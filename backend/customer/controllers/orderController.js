const {
  getCustomerCartItems,
  createOrder,
  createOrderItem,
  reduceVariantStock,
  clearCustomerCart,
  getCustomerOrders,
  getCustomerOrderById,
  getCustomerOrderForCancellation,
  restoreVariantStock,
  cancelCustomerOrder,
} = require("../models/orderModel");

const {
  createCustomerNotification,
} = require("../models/notificationModel");

const { pool } = require("../../config/database");
const { assertRazorpayPayment } = require("./paymentController");


/*
|--------------------------------------------------------------------------
| PLACE ORDER
|--------------------------------------------------------------------------
| POST /api/customer/orders
|--------------------------------------------------------------------------
*/

const placeOrder = async (req, res) => {
  const customerId = req.customer.id;

  let connection;

  try {
    /*
    |--------------------------------------------------------------------------
    | Checkout Details
    |--------------------------------------------------------------------------
    */

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      alternative_address,
      payment_method,
      notes,
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | Validate Customer Name
    |--------------------------------------------------------------------------
    */

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Customer Email
    |--------------------------------------------------------------------------
    */

    if (!customer_email || !customer_email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Customer Phone
    |--------------------------------------------------------------------------
    */

    if (!customer_phone || !customer_phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer phone is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Shipping Address
    |--------------------------------------------------------------------------
    */

    if (!shipping_address || !shipping_address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Shipping City
    |--------------------------------------------------------------------------
    */

    if (!shipping_city || !shipping_city.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping city is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Shipping State
    |--------------------------------------------------------------------------
    */

    if (!shipping_state || !shipping_state.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping state is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Shipping Pincode
    |--------------------------------------------------------------------------
    */

    if (!shipping_pincode || !shipping_pincode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping pincode is required",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Payment Method
    |--------------------------------------------------------------------------
    */

    const selectedPaymentMethod = payment_method
      ? payment_method.toUpperCase()
      : "COD";

    if (!["COD", "ONLINE"].includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Payment method must be COD or ONLINE",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Get Database Connection
    |--------------------------------------------------------------------------
    */

    connection = await pool.getConnection();


    /*
    |--------------------------------------------------------------------------
    | Start Transaction
    |--------------------------------------------------------------------------
    */

    await connection.beginTransaction();


    /*
    |--------------------------------------------------------------------------
    | Get Customer Cart
    |--------------------------------------------------------------------------
    */

    const cartItems = await getCustomerCartItems(
      customerId,
      connection
    );


    /*
    |--------------------------------------------------------------------------
    | Check Empty Cart
    |--------------------------------------------------------------------------
    */

    if (cartItems.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Products + Variants + Stock
    |--------------------------------------------------------------------------
    */

    let subtotal = 0;

    for (const item of cartItems) {

      /*
      |--------------------------------------------------------------------------
      | Product Status
      |--------------------------------------------------------------------------
      */

      if (item.product_status !== "ACTIVE") {
        throw new Error(
          `Product "${item.product_name}" is no longer available`
        );
      }


      /*
      |--------------------------------------------------------------------------
      | Variant Status
      |--------------------------------------------------------------------------
      */

      if (item.variant_status !== "ACTIVE") {
        throw new Error(
          `Variant "${item.variant_name}" is no longer available`
        );
      }


      /*
      |--------------------------------------------------------------------------
      | Stock Validation
      |--------------------------------------------------------------------------
      */

      if (item.stock_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${item.product_name}" - ${item.variant_name}`
        );
      }


      /*
      |--------------------------------------------------------------------------
      | Calculate Item Subtotal
      |--------------------------------------------------------------------------
      */

      const itemSubtotal =
        Number(item.selling_price) *
        Number(item.quantity);

      subtotal += itemSubtotal;
    }


    /*
    |--------------------------------------------------------------------------
    | Discount
    |--------------------------------------------------------------------------
    |
    | Coupon / discount system is not currently used.
    |
    */

    const discountAmount = 0;


    /*
    |--------------------------------------------------------------------------
    | Get Shipping Settings
    |--------------------------------------------------------------------------
    */

    const [settingsRows] = await connection.execute(
      `
        SELECT
          shipping_charge,
          free_shipping_threshold
        FROM store_settings
        ORDER BY id ASC
        LIMIT 1
      `
    );


    /*
    |--------------------------------------------------------------------------
    | Calculate Shipping
    |--------------------------------------------------------------------------
    */

    let shippingCharge = 0;

    if (settingsRows.length > 0) {

      const settings = settingsRows[0];

      const configuredShippingCharge =
        Number(settings.shipping_charge);

      const freeShippingThreshold =
        Number(settings.free_shipping_threshold);


      /*
      |--------------------------------------------------------------------------
      | Free Shipping
      |--------------------------------------------------------------------------
      */

      if (
        freeShippingThreshold <= 0 ||
        subtotal < freeShippingThreshold
      ) {
        shippingCharge = configuredShippingCharge;
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Total
    |--------------------------------------------------------------------------
    */

    const totalAmount =
      subtotal -
      discountAmount +
      shippingCharge;


    /*
    |--------------------------------------------------------------------------
    | Payment Status
    |--------------------------------------------------------------------------
    |
    | COD stays pending until delivery.
    | ONLINE is accepted only after Razorpay verifies the payment.
    |
    */

    let paymentStatus = "PENDING";
    let razorpayPaymentId = null;

    if (selectedPaymentMethod === "ONLINE") {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      try {
        await assertRazorpayPayment({
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          totalAmount,
        });
      } catch (verifyError) {
        await connection.rollback();

        return res.status(verifyError.statusCode || 400).json({
          success: false,
          message: verifyError.message || "Payment verification failed",
        });
      }

      paymentStatus = "PAID";
      razorpayPaymentId = razorpay_payment_id;
    }


    /*
    |--------------------------------------------------------------------------
    | Initial Order Status
    |--------------------------------------------------------------------------
    */

    const orderStatus = "PENDING";


    /*
    |--------------------------------------------------------------------------
    | Create Order
    |--------------------------------------------------------------------------
    */

    const order = await createOrder(connection, {

      customerId,

      customerName:
        customer_name.trim(),

      customerEmail:
        customer_email.trim(),

      customerPhone:
        customer_phone.trim(),

      shippingAddress:
        shipping_address.trim(),

      shippingCity:
        shipping_city.trim(),

      shippingState:
        shipping_state.trim(),

      shippingPincode:
        shipping_pincode.trim(),

      alternativeAddress:
        alternative_address &&
        alternative_address.trim()
          ? alternative_address.trim()
          : null,

      subtotal,

      discountAmount,

      shippingCharge,

      totalAmount,

      paymentMethod:
        selectedPaymentMethod,

      paymentStatus,

      orderStatus,

      notes: [
        notes && notes.trim() ? notes.trim() : "",
        razorpayPaymentId ? `Razorpay: ${razorpayPaymentId}` : "",
      ].filter(Boolean).join("\n") || null,
    });


    /*
    |--------------------------------------------------------------------------
    | Create Order Items + Reduce Stock
    |--------------------------------------------------------------------------
    */

    for (const item of cartItems) {

      /*
      |--------------------------------------------------------------------------
      | Calculate Item Subtotal
      |--------------------------------------------------------------------------
      */

      const itemSubtotal =
        Number(item.selling_price) *
        Number(item.quantity);


      /*
      |--------------------------------------------------------------------------
      | Create Order Item
      |--------------------------------------------------------------------------
      */

      await createOrderItem(connection, {

        orderId:
          order.id,

        productId:
          item.product_id,

        variantId:
          item.variant_id,

        productName:
          item.product_name,

        variantName:
          item.variant_name,

        color:
          item.color,

        quantity:
          item.quantity,

        unitPrice:
          item.selling_price,

        itemSubtotal,
      });


      /*
      |--------------------------------------------------------------------------
      | Reduce Variant Stock
      |--------------------------------------------------------------------------
      */

      await reduceVariantStock(
        connection,
        item.variant_id,
        item.quantity
      );
    }


    /*
    |--------------------------------------------------------------------------
    | Clear Customer Cart
    |--------------------------------------------------------------------------
    */

    await clearCustomerCart(
      connection,
      customerId
    );


    /*
    |--------------------------------------------------------------------------
    | CUSTOMER NOTIFICATION
    |--------------------------------------------------------------------------
    |
    | The customer gets their own notification.
    |
    | This is created BEFORE COMMIT so that:
    |
    | Order
    | Order Items
    | Stock Reduction
    | Cart Clearing
    | Notification
    |
    | all belong to the same transaction.
    |
    */

    await createCustomerNotification(
      connection,
      {
        customer_id:
          customerId,

        type:
          "NEW_ORDER",

        title:
          "Order Placed Successfully",

        message:
          `Your order ${order.orderNumber} has been placed successfully.`,

        reference_type:
          "ORDER",

        reference_id:
          order.id,
      }
    );


    /*
    |--------------------------------------------------------------------------
    | Commit Transaction
    |--------------------------------------------------------------------------
    */

    await connection.commit();


    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully",

      data: {

        order_id:
          order.id,

        order_number:
          order.orderNumber,

        subtotal:
          Number(
            subtotal.toFixed(2)
          ),

        discount_amount:
          Number(
            discountAmount.toFixed(2)
          ),

        shipping_charge:
          Number(
            shippingCharge.toFixed(2)
          ),

        total_amount:
          Number(
            totalAmount.toFixed(2)
          ),

        payment_method:
          selectedPaymentMethod,

        payment_status:
          paymentStatus,

        order_status:
          orderStatus,
      },
    });

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | Rollback Transaction
    |--------------------------------------------------------------------------
    */

    if (connection) {

      try {
        await connection.rollback();

      } catch (rollbackError) {

        console.error(
          "Rollback failed:",
          rollbackError.message
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Log Error
    |--------------------------------------------------------------------------
    */

    console.error(
      "Place order error:",
      error
    );


    /*
    |--------------------------------------------------------------------------
    | Error Response
    |--------------------------------------------------------------------------
    */

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to place order",
    });

  } finally {

    /*
    |--------------------------------------------------------------------------
    | Release Connection
    |--------------------------------------------------------------------------
    */

    if (connection) {
      connection.release();
    }
  }
};


/*
|--------------------------------------------------------------------------
| GET MY ORDERS
|--------------------------------------------------------------------------
| GET /api/customer/orders
|--------------------------------------------------------------------------
*/

const getMyOrders = async (req, res) => {

  try {

    const customerId =
      req.customer.id;


    const orders =
      await getCustomerOrders(
        customerId
      );


    return res.status(200).json({

      success: true,

      count:
        orders.length,

      data:
        orders,
    });

  } catch (error) {

    console.error(
      "Get customer orders error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch orders",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET MY ORDER BY ID
|--------------------------------------------------------------------------
| GET /api/customer/orders/:id
|--------------------------------------------------------------------------
*/

const getMyOrderById = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.id;

    const orderId =
      Number(req.params.id);


    /*
    |--------------------------------------------------------------------------
    | Validate Order ID
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid order ID",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Get Customer Order
    |--------------------------------------------------------------------------
    |
    | Model must verify customer ownership.
    |
    */

    const order =
      await getCustomerOrderById(
        customerId,
        orderId
      );


    /*
    |--------------------------------------------------------------------------
    | Order Not Found
    |--------------------------------------------------------------------------
    */

    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({

      success: true,

      data:
        order,
    });

  } catch (error) {

    console.error(
      "Get customer order error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch order",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CANCEL MY ORDER
|--------------------------------------------------------------------------
| PATCH /api/customer/orders/:id/cancel
|--------------------------------------------------------------------------
*/

const cancelMyOrder = async (
  req,
  res
) => {

  const customerId =
    req.customer.id;

  const orderId =
    Number(req.params.id);

  let connection;


  try {

    /*
    |--------------------------------------------------------------------------
    | Validate Order ID
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid order ID",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Get Database Connection
    |--------------------------------------------------------------------------
    */

    connection =
      await pool.getConnection();


    /*
    |--------------------------------------------------------------------------
    | Start Transaction
    |--------------------------------------------------------------------------
    */

    await connection.beginTransaction();


    /*
    |--------------------------------------------------------------------------
    | Get Order + Items
    |--------------------------------------------------------------------------
    |
    | This also verifies that the order belongs
    | to the logged-in customer.
    |
    */

    const order =
      await getCustomerOrderForCancellation(
        connection,
        customerId,
        orderId
      );


    /*
    |--------------------------------------------------------------------------
    | Order Not Found
    |--------------------------------------------------------------------------
    */

    if (!order) {

      await connection.rollback();

      return res.status(404).json({

        success: false,

        message:
          "Order not found",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Allowed Cancellation Statuses
    |--------------------------------------------------------------------------
    */

    const cancellableStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
    ];


    /*
    |--------------------------------------------------------------------------
    | Check Order Status
    |--------------------------------------------------------------------------
    */

    if (
      !cancellableStatuses.includes(
        order.order_status
      )
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          `Order cannot be cancelled because its current status is ${order.order_status}`,
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Order Items
    |--------------------------------------------------------------------------
    */

    if (
      !order.items ||
      order.items.length === 0
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          "Order has no items to restore",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Variant Stock
    |--------------------------------------------------------------------------
    */

    for (const item of order.items) {

      await restoreVariantStock(
        connection,
        item.variant_id,
        item.quantity
      );
    }


    /*
    |--------------------------------------------------------------------------
    | Change Order Status To CANCELLED
    |--------------------------------------------------------------------------
    */

    const updatedRows =
      await cancelCustomerOrder(
        connection,
        orderId,
        customerId
      );


    /*
    |--------------------------------------------------------------------------
    | Verify Order Was Cancelled
    |--------------------------------------------------------------------------
    */

    if (updatedRows !== 1) {

      throw new Error(
        "Failed to cancel the order"
      );
    }


    /*
    |--------------------------------------------------------------------------
    | CUSTOMER CANCELLATION NOTIFICATION
    |--------------------------------------------------------------------------
    */

    await createCustomerNotification(
      connection,
      {
        customer_id:
          customerId,

        type:
          "ORDER_CANCELLED",

        title:
          "Order Cancelled",

        message:
          `Your order ${order.order_number} has been cancelled successfully.`,

        reference_type:
          "ORDER",

        reference_id:
          orderId,
      }
    );


    /*
    |--------------------------------------------------------------------------
    | Commit Transaction
    |--------------------------------------------------------------------------
    */

    await connection.commit();


    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({

      success: true,

      message:
        "Order cancelled successfully",

      data: {

        order_id:
          order.id,

        order_number:
          order.order_number,

        order_status:
          "CANCELLED",
      },
    });

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | Rollback
    |--------------------------------------------------------------------------
    */

    if (connection) {

      try {

        await connection.rollback();

      } catch (rollbackError) {

        console.error(
          "Rollback failed:",
          rollbackError.message
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Log Error
    |--------------------------------------------------------------------------
    */

    console.error(
      "Cancel order error:",
      error
    );


    /*
    |--------------------------------------------------------------------------
    | Error Response
    |--------------------------------------------------------------------------
    */

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to cancel order",
    });

  } finally {

    /*
    |--------------------------------------------------------------------------
    | Release Connection
    |--------------------------------------------------------------------------
    */

    if (connection) {
      connection.release();
    }
  }
};


/*
|--------------------------------------------------------------------------
| EXPORT CONTROLLERS
|--------------------------------------------------------------------------
*/

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
};
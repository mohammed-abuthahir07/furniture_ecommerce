const {
  getCustomerCartItems,
  createOrder,
  createOrderItem,
  reduceVariantStock,
  clearCustomerCart,
  getCustomerOrders,
  getCustomerOrderById,
} = require("../models/orderModel");

const { pool } = require("../../config/database");

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
    | Validate Checkout Details
    |--------------------------------------------------------------------------
    */

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!customer_email || !customer_email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    if (!customer_phone || !customer_phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer phone is required",
      });
    }

    if (!shipping_address || !shipping_address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!shipping_city || !shipping_city.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping city is required",
      });
    }

    if (!shipping_state || !shipping_state.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping state is required",
      });
    }

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

    if (cartItems.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Products & Stock
    |--------------------------------------------------------------------------
    */

    let subtotal = 0;

    for (const item of cartItems) {
      if (item.product_status !== "ACTIVE") {
        throw new Error(
          `Product "${item.product_name}" is no longer available`
        );
      }

      if (item.variant_status !== "ACTIVE") {
        throw new Error(
          `Variant "${item.variant_name}" is no longer available`
        );
      }

      if (item.stock_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${item.product_name}" - ${item.variant_name}`
        );
      }

      const itemSubtotal =
        Number(item.selling_price) * Number(item.quantity);

      subtotal += itemSubtotal;
    }

    /*
    |--------------------------------------------------------------------------
    | Discount
    |--------------------------------------------------------------------------
    |
    | No coupon/discount system is currently used.
    |
    */

    const discountAmount = 0;

    /*
    |--------------------------------------------------------------------------
    | Get Store Shipping Settings
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

    let shippingCharge = 0;

    if (settingsRows.length > 0) {
      const settings = settingsRows[0];

      const configuredShippingCharge =
        Number(settings.shipping_charge);

      const freeShippingThreshold =
        Number(settings.free_shipping_threshold);

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
    */

    const paymentStatus =
      selectedPaymentMethod === "COD"
        ? "PENDING"
        : "PENDING";

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
      customerName: customer_name.trim(),
      customerEmail: customer_email.trim(),
      customerPhone: customer_phone.trim(),
      shippingAddress: shipping_address.trim(),
      shippingCity: shipping_city.trim(),
      shippingState: shipping_state.trim(),
      shippingPincode: shipping_pincode.trim(),
      alternativeAddress:
        alternative_address &&
        alternative_address.trim()
          ? alternative_address.trim()
          : null,
      subtotal,
      discountAmount,
      shippingCharge,
      totalAmount,
      paymentMethod: selectedPaymentMethod,
      paymentStatus,
      orderStatus,
      notes:
        notes && notes.trim()
          ? notes.trim()
          : null,
    });

    /*
    |--------------------------------------------------------------------------
    | Create Order Items + Reduce Stock
    |--------------------------------------------------------------------------
    */

    for (const item of cartItems) {
      const itemSubtotal =
        Number(item.selling_price) *
        Number(item.quantity);

      /*
      | Create Order Item
      */

      await createOrderItem(connection, {
        orderId: order.id,
        productId: item.product_id,
        variantId: item.variant_id,
        productName: item.product_name,
        variantName: item.variant_name,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.selling_price,
        itemSubtotal,
      });

      /*
      | Reduce Stock
      */

      await reduceVariantStock(
        connection,
        item.variant_id,
        item.quantity
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Clear Cart
    |--------------------------------------------------------------------------
    */

    await clearCustomerCart(
      connection,
      customerId
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
      message: "Order placed successfully",
      data: {
        order_id: order.id,
        order_number: order.orderNumber,
        subtotal: Number(subtotal.toFixed(2)),
        discount_amount: Number(
          discountAmount.toFixed(2)
        ),
        shipping_charge: Number(
          shippingCharge.toFixed(2)
        ),
        total_amount: Number(
          totalAmount.toFixed(2)
        ),
        payment_method: selectedPaymentMethod,
        payment_status: paymentStatus,
        order_status: orderStatus,
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

    console.error(
      "Place order error:",
      error
    );

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
    const customerId = req.customer.id;

    const orders = await getCustomerOrders(
      customerId
    );

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get customer orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
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

const getMyOrderById = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const orderId = req.params.id;

    if (!Number.isInteger(Number(orderId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await getCustomerOrderById(
      customerId,
      Number(orderId)
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Get customer order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrderById,
};
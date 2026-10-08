const crypto = require("crypto");
const Razorpay = require("razorpay");
const { pool } = require("../../config/database");
const { getCustomerCartItems } = require("../models/orderModel");

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error("Online payment is not configured");
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const quoteCustomerCart = async (customerId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cartItems = await getCustomerCartItems(customerId, connection);

    let subtotal = 0;

    for (const item of cartItems) {
      if (item.product_status !== "ACTIVE" || item.variant_status !== "ACTIVE") {
        const error = new Error(`"${item.product_name}" is no longer available`);
        error.statusCode = 400;
        throw error;
      }

      if (Number(item.stock_quantity) < Number(item.quantity)) {
        const error = new Error(
          `Insufficient stock for "${item.product_name}" - ${item.variant_name}`
        );
        error.statusCode = 400;
        throw error;
      }

      subtotal += Number(item.selling_price) * Number(item.quantity);
    }

    const [settingsRows] = await connection.execute(
      `
        SELECT shipping_charge, free_shipping_threshold
        FROM store_settings
        ORDER BY id ASC
        LIMIT 1
      `
    );

    let shippingCharge = 0;

    if (settingsRows.length > 0) {
      const configuredShippingCharge = Number(settingsRows[0].shipping_charge);
      const freeShippingThreshold = Number(settingsRows[0].free_shipping_threshold);

      if (freeShippingThreshold <= 0 || subtotal < freeShippingThreshold) {
        shippingCharge = configuredShippingCharge;
      }
    }

    await connection.rollback();

    return {
      itemCount: cartItems.length,
      subtotal,
      shippingCharge,
      totalAmount: subtotal + shippingCharge,
    };
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // The quote transaction is only used to price the cart.
    }
    throw error;
  } finally {
    connection.release();
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const quote = await quoteCustomerCart(req.customer.id);

    if (quote.itemCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const amount = Math.round(Number(quote.totalAmount.toFixed(2)) * 100);

    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "This order total cannot be paid online",
      });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `wc${req.customer.id}${Date.now()}`.slice(0, 40),
      notes: {
        customer_id: String(req.customer.id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Online payment started",
      data: {
        key_id: process.env.RAZORPAY_KEY_ID,
        razorpay_order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        total_amount: Number(quote.totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Failed to start online payment",
    });
  }
};

const assertRazorpayPayment = async ({
  orderId,
  paymentId,
  signature,
  totalAmount,
}) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret || !orderId || !paymentId || !signature) {
    const error = new Error("Complete the online payment before placing this order");
    error.statusCode = 400;
    throw error;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const signatureBuffer = Buffer.from(String(signature));
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    const error = new Error("Payment verification failed");
    error.statusCode = 400;
    throw error;
  }

  const razorpay = getRazorpay();
  const payment = await razorpay.payments.fetch(paymentId);
  const expectedPaise = Math.round(Number(Number(totalAmount).toFixed(2)) * 100);

  if (payment.order_id !== orderId) {
    const error = new Error("Payment does not match this furniture order");
    error.statusCode = 400;
    throw error;
  }

  if (!["captured", "authorized"].includes(payment.status)) {
    const error = new Error("Payment was not completed");
    error.statusCode = 400;
    throw error;
  }

  if (Number(payment.amount) !== expectedPaise) {
    const error = new Error("Paid amount does not match the furniture order total");
    error.statusCode = 400;
    throw error;
  }

  return payment;
};

module.exports = {
  createRazorpayOrder,
  assertRazorpayPayment,
};

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatInr = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const sendOrderConfirmationEmail = async ({
  customerName,
  customerEmail,
  orderNumber,
  items,
  subtotal,
  discountAmount,
  shippingCharge,
  totalAmount,
  paymentMethod,
  paymentStatus,
  shippingAddress,
  shippingCity,
  shippingState,
  shippingPincode,
}) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !customerEmail) {
    return;
  }

  const paymentLabel = paymentMethod === "ONLINE" ? "Online payment" : "Cash on delivery";
  const itemRows = (items || [])
    .map((item) => {
      const lineTotal = Number(item.selling_price) * Number(item.quantity);
      return `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">
            ${escapeHtml(item.product_name)}
            <div style="color:#666;font-size:12px;">${escapeHtml(item.variant_name || item.color || "")}</div>
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">${escapeHtml(item.quantity)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(formatInr(lineTotal))}</td>
        </tr>
      `;
    })
    .join("");

  const address = [
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPincode,
  ].filter(Boolean).map(escapeHtml).join(", ");

  await transporter.sendMail({
    from: `"WoodCraft" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Your WoodCraft order ${orderNumber} is confirmed`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1f2933;">
        <h2 style="margin-bottom:8px;">Order confirmed</h2>
        <p>Hello ${escapeHtml(customerName || "there")},</p>
        <p>Your furniture order <strong>${escapeHtml(orderNumber)}</strong> was placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">Piece</th>
              <th style="text-align:center;padding:8px;border-bottom:1px solid #ddd;">Qty</th>
              <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p>Subtotal: ${escapeHtml(formatInr(subtotal))}</p>
        <p>Discount: ${escapeHtml(formatInr(discountAmount))}</p>
        <p>Shipping: ${escapeHtml(formatInr(shippingCharge))}</p>
        <p><strong>Total: ${escapeHtml(formatInr(totalAmount))}</strong></p>
        <p>Payment: ${escapeHtml(paymentLabel)} (${escapeHtml(paymentStatus)})</p>
        <p>Delivery address: ${address}</p>
        <p>We will update you as the order moves through confirmation, crafting, and delivery.</p>
      </div>
    `,
  });
};

module.exports = {
  sendOrderConfirmationEmail,
};

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const adminAuthRoutes = require("./admin/routes/adminAuthRoutes");
const categoryRoutes = require("./admin/routes/categoryRoutes");
const productRoutes = require("./admin/routes/productRoutes");
const productVariantRoutes = require("./admin/routes/productVariantRoutes");
const productImageRoutes = require("./admin/routes/productImageRoutes");
const offerRoutes = require("./admin/routes/offerRoutes");
const orderRoutes = require("./admin/routes/orderRoutes");
const dashboardRoutes = require("./admin/routes/dashboardRoutes");
const customerRoutes = require("./admin/routes/customerRoutes");
const inventoryRoutes = require("./admin/routes/inventoryRoutes");
const reportRoutes = require("./admin/routes/reportRoutes");
const analyticsRoutes = require("./admin/routes/analyticsRoutes");
const notificationRoutes = require("./admin/routes/notificationRoutes");
const settingsRoutes = require("./admin/routes/settingsRoutes");
const customizationRequestRoutes = require("./admin/routes/customizationRequestRoutes");
const customerAuthRoutes = require("./customer/routes/customerAuthRoutes");
const customerProfileRoutes = require("./customer/routes/customerProfileRoutes");
const wishlistRoutes = require("./customer/routes/wishlistRoutes");
const reviewRoutes = require("./customer/routes/reviewRoutes");
const publicReviewRoutes = require("./public/routes/publicReviewRoutes");
const cartRoutes = require("./customer/routes/cartRoutes");
const customizationRequestRoutes1 =require("./customer/routes/customizationRequestRoutes");
const orderRoutes1 = require("./customer/routes/orderRoutes");
const paymentRoutes = require("./customer/routes/paymentRoutes");
const notificationRoutes1 = require("./customer/routes/notificationRoutes");
const forgotPasswordRoutes = require("./customer/routes/forgotPasswordRoutes")
const publicCategoryRoutes = require("./public/routes/categoryRoutes");
const publicProductRoutes = require("./public/routes/productRoutes");
const publicProductFilterRoutes = require("./public/routes/productFilterRoutes");
const publicOfferRoutes = require( "./public/routes/offerRoutes");
const publicRecommendationRoutes = require("./public/routes/recommendationRoutes");
const publicComparisonRoutes = require("./public/routes/comparisonRoutes");
const customRequirementRoutes = require("./public/routes/customRequirementRoutes");
const adminCustomRequirementRoutes = require("./admin/routes/customRequirementRoutes");

const compression = require("compression");

const app = express();

app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 500 && body && typeof body === "object" && !Array.isArray(body)) {
      const message = String(body.message || "");
      if (/sql|ER_|ECONN|syntax error|stack|at \w+\s+\(/i.test(message)) {
        return sendJson({
          ...body,
          message: "Something went wrong on our side. Please try again in a moment.",
        });
      }
    }
    return sendJson(body);
  };
  next();
});

// PUBLIC
app.use("/api/public/categories", publicCategoryRoutes);
app.use("/api/public/products",publicReviewRoutes);
app.use("/api/public/products", publicProductRoutes);
app.use("/api/public/product-filters",publicProductFilterRoutes);
app.use("/api/public/offers",publicOfferRoutes);
app.use("/api/public/recommendations",publicRecommendationRoutes);
app.use("/api/public/products/compare",publicComparisonRoutes);
app.use("/api/public/custom-requirements",customRequirementRoutes);

// CUSTOMER
app.use("/api/customer/auth",customerAuthRoutes);
app.use("/api/customer/profile",customerProfileRoutes);
app.use("/api/customer/reviews", reviewRoutes);
app.use("/api/customer/cart",cartRoutes);
app.use("/api/customer/customization-requests",customizationRequestRoutes1);
app.use("/api/customer/wishlist", wishlistRoutes);
app.use("/api/customer/orders",orderRoutes1);
app.use("/api/customer/payments", paymentRoutes);
app.use("/api/customer/notifications",notificationRoutes1);
app.use("/api/customer/auth",forgotPasswordRoutes);

// ADMIN
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/product-variants",productVariantRoutes);
app.use("/api/admin/product-images",productImageRoutes);
app.use("/api/admin/offers",offerRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/admin/reports", reportRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/notifications",notificationRoutes);
app.use("/api/admin/settings",settingsRoutes);
app.use("/api/admin/customization-requests", customizationRequestRoutes);
app.use("/api/admin/custom-requirements",adminCustomRequirementRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested resource could not be found.",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our side. Please try again in a moment.",
  });
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
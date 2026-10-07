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
const notificationRoutes1 = require("./customer/routes/notificationRoutes");
const forgotPasswordRoutes = require("./customer/routes/forgotPasswordRoutes")

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CUSTOMER
app.use("/api/customer/auth",customerAuthRoutes);
app.use("/api/customer/profile",customerProfileRoutes);
app.use("/api/customer/reviews", reviewRoutes);
app.use("/api/customer/cart",cartRoutes);
app.use("/api/customer/customization-requests",customizationRequestRoutes1);
app.use("/api/customer/wishlist", wishlistRoutes);
app.use("/api/customer/orders",orderRoutes1);
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


// Public 
app.use("/api/public/products",publicReviewRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
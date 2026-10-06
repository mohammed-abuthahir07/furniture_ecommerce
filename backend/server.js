const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/database");
const adminAuthRoutes = require("./admin/routes/adminAuthRoutes");
const categoryRoutes = require("./admin/routes/categoryRoutes");
const productRoutes = require("./admin/routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ADMIN
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/products", productRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
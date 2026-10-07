const express = require("express");

const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

// ======================================================
// GET ALL ACTIVE PRODUCTS
// GET /api/public/products
// ======================================================

router.get("/", getProducts);

// ======================================================
// GET ONE ACTIVE PRODUCT
// GET /api/public/products/:id
// ======================================================

router.get("/:id", getProductById);

module.exports = router;
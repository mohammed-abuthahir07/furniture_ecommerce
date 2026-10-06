const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/productController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// CREATE PRODUCT
router.post(
  "/",
  adminAuthMiddleware,
  createProduct
);


// GET ALL PRODUCTS
router.get(
  "/",
  adminAuthMiddleware,
  getAllProducts
);


// GET PRODUCT BY ID
router.get(
  "/:id",
  adminAuthMiddleware,
  getProductById
);


// UPDATE PRODUCT
router.put(
  "/:id",
  adminAuthMiddleware,
  updateProduct
);


// ACTIVATE / DEACTIVATE PRODUCT
router.patch(
  "/:id/status",
  adminAuthMiddleware,
  updateProductStatus
);


// DELETE PRODUCT
router.delete(
  "/:id",
  adminAuthMiddleware,
  deleteProduct
);


module.exports = router;
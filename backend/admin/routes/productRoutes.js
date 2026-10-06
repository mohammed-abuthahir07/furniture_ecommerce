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
const productUpload = require("../../middleware/productUploadMiddleware");

const router = express.Router();


// CREATE PRODUCT
// Main image is required
router.post(
  "/",
  adminAuthMiddleware,
  productUpload.single("main_image"),
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
// Main image is optional during update
router.put(
  "/:id",
  adminAuthMiddleware,
  productUpload.single("main_image"),
  updateProduct
);


// UPDATE PRODUCT STATUS
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
const express = require("express");

const {
  createProductImage,
  getImagesByProductId,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
} = require("../controllers/productImageController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");
const productUpload = require("../../middleware/productUploadMiddleware");

const router = express.Router();

// ADD PRODUCT GALLERY IMAGE
router.post(
  "/",
  adminAuthMiddleware,
  productUpload.single("image"),
  createProductImage
);

// GET ALL IMAGES FOR A PRODUCT
router.get(
  "/product/:productId",
  adminAuthMiddleware,
  getImagesByProductId
);

// GET SINGLE IMAGE
router.get(
  "/:id",
  adminAuthMiddleware,
  getProductImageById
);

// UPDATE IMAGE TITLE / SORT ORDER
router.put(
  "/:id",
  adminAuthMiddleware,
  updateProductImage
);

// DELETE IMAGE
router.delete(
  "/:id",
  adminAuthMiddleware,
  deleteProductImage
);

module.exports = router;
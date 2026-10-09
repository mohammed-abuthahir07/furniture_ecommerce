const express = require("express");
const multer = require("multer");

const {
  createVariantImages,
  getImagesByVariantId,
  updateVariantImage,
  reorderVariantImages,
  deleteVariantImage,
} = require("../controllers/productVariantImageController");
const productVariantImageModel = require("../models/productVariantImageModel");
const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");
const productUpload = require("../../middleware/productUploadMiddleware");

const router = express.Router();

const uploadVariantImages = (req, res, next) => {
  productUpload.array("images", 8)(req, res, (error) => {
    if (!error) return next();

    productVariantImageModel.removeImageFiles(
      (req.files || []).map((file) => `/uploads/products/${file.filename}`)
    );

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Each photo must be 5MB or smaller.",
      });
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "You can upload up to 8 photos at a time.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Those photos could not be uploaded.",
    });
  });
};

router.post("/", adminAuthMiddleware, uploadVariantImages, createVariantImages);
router.get("/variant/:variantId", adminAuthMiddleware, getImagesByVariantId);
router.put("/reorder", adminAuthMiddleware, reorderVariantImages);
router.put("/:id", adminAuthMiddleware, updateVariantImage);
router.delete("/:id", adminAuthMiddleware, deleteVariantImage);

module.exports = router;

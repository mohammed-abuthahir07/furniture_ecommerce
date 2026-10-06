const productImageModel = require("../models/productImageModel");
const productModel = require("../models/productModel");

// CREATE PRODUCT IMAGE
const createProductImage = async (req, res) => {
  try {
    const {
      product_id,
      image_title,
      sort_order,
    } = req.body;

    // Validate product ID
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate uploaded image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product gallery image is required",
      });
    }

    // Validate sort order
    if (
      sort_order !== undefined &&
      sort_order !== null &&
      sort_order !== "" &&
      (!Number.isInteger(Number(sort_order)) ||
        Number(sort_order) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sort order must be a non-negative whole number",
      });
    }

    // Check product
    const product = await productModel.getProductById(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Product must be active
    if (product.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Cannot add image to an inactive product",
      });
    }

    const imagePath = `/uploads/products/${req.file.filename}`;

    const imageId = await productImageModel.createProductImage({
      product_id,
      image: imagePath,
      image_title: image_title
        ? image_title.trim()
        : null,
      sort_order:
        sort_order !== undefined &&
        sort_order !== ""
          ? Number(sort_order)
          : 0,
    });

    const image =
      await productImageModel.getProductImageById(imageId);

    return res.status(201).json({
      success: true,
      message: "Product gallery image added successfully",
      image,
    });
  } catch (error) {
    console.error(
      "Create product image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL PRODUCT IMAGES
const getImagesByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check product
    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const images =
      await productImageModel.getImagesByProductId(
        productId
      );

    return res.status(200).json({
      success: true,
      message: "Product gallery images fetched successfully",
      product: {
        id: product.id,
        name: product.name,
        main_image: product.main_image,
      },
      images,
    });
  } catch (error) {
    console.error(
      "Get product images error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET SINGLE PRODUCT IMAGE
const getProductImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image =
      await productImageModel.getProductImageById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product image fetched successfully",
      image,
    });
  } catch (error) {
    console.error(
      "Get product image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE PRODUCT IMAGE DETAILS
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image_title,
      sort_order,
    } = req.body;

    // Check image
    const existingImage =
      await productImageModel.getProductImageById(id);

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    // Validate sort order
    if (
      sort_order !== undefined &&
      sort_order !== null &&
      sort_order !== "" &&
      (!Number.isInteger(Number(sort_order)) ||
        Number(sort_order) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sort order must be a non-negative whole number",
      });
    }

    await productImageModel.updateProductImage(id, {
      image_title:
        image_title !== undefined
          ? image_title.trim()
          : existingImage.image_title,

      sort_order:
        sort_order !== undefined &&
        sort_order !== ""
          ? Number(sort_order)
          : existingImage.sort_order,
    });

    const updatedImage =
      await productImageModel.getProductImageById(id);

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    console.error(
      "Update product image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE PRODUCT IMAGE
const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const existingImage =
      await productImageModel.getProductImageById(id);

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    await productImageModel.deleteProductImage(id);

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProductImage,
  getImagesByProductId,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
};
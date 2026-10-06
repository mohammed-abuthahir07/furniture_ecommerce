const productVariantModel = require("../models/productVariantModel");
const productModel = require("../models/productModel");

// CREATE VARIANT
const createVariant = async (req, res) => {
  try {
    const { product_id, variant_name, color, stock_quantity } = req.body;

    // Validate product ID
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate variant name
    if (!variant_name || !variant_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Variant name is required",
      });
    }

    // Validate stock
    if (
      stock_quantity === undefined ||
      stock_quantity === null ||
      stock_quantity === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity is required",
      });
    }

    if (!Number.isInteger(Number(stock_quantity))) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a whole number",
      });
    }

    if (Number(stock_quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity cannot be negative",
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
        message: "Cannot create variant for an inactive product",
      });
    }

    // Check duplicate variant
    const existingVariant =
      await productVariantModel.findVariantByName(
        product_id,
        variant_name.trim()
      );

    if (existingVariant) {
      return res.status(409).json({
        success: false,
        message: "This variant already exists for this product",
      });
    }

    const variantId = await productVariantModel.createVariant({
      product_id,
      variant_name: variant_name.trim(),
      color,
      stock_quantity: Number(stock_quantity),
    });

    const variant =
      await productVariantModel.getVariantById(variantId);

    return res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      variant,
    });
  } catch (error) {
    console.error("Create product variant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL VARIANTS FOR PRODUCT
const getVariantsByProductId = async (req, res) => {
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

    const variants =
      await productVariantModel.getVariantsByProductId(productId);

    return res.status(200).json({
      success: true,
      message: "Product variants fetched successfully",
      product: {
        id: product.id,
        name: product.name,
        main_image: product.main_image,
      },
      variants,
    });
  } catch (error) {
    console.error(
      "Get product variants error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET SINGLE VARIANT
const getVariantById = async (req, res) => {
  try {
    const { id } = req.params;

    const variant =
      await productVariantModel.getVariantById(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product variant fetched successfully",
      variant,
    });
  } catch (error) {
    console.error(
      "Get product variant error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE VARIANT
const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      variant_name,
      color,
      stock_quantity,
    } = req.body;

    // Check variant
    const existingVariant =
      await productVariantModel.getVariantById(id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    // Validate variant name
    if (!variant_name || !variant_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Variant name is required",
      });
    }

    // Validate stock
    if (
      stock_quantity === undefined ||
      stock_quantity === null ||
      stock_quantity === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity is required",
      });
    }

    if (!Number.isInteger(Number(stock_quantity))) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a whole number",
      });
    }

    if (Number(stock_quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity cannot be negative",
      });
    }

    // Check duplicate variant
    const duplicateVariant =
      await productVariantModel.findVariantByName(
        existingVariant.product_id,
        variant_name.trim(),
        id
      );

    if (duplicateVariant) {
      return res.status(409).json({
        success: false,
        message: "Another variant with this name already exists",
      });
    }

    await productVariantModel.updateVariant(id, {
      variant_name: variant_name.trim(),
      color,
      stock_quantity: Number(stock_quantity),
    });

    const updatedVariant =
      await productVariantModel.getVariantById(id);

    return res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      variant: updatedVariant,
    });
  } catch (error) {
    console.error(
      "Update product variant error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE STOCK
const updateVariantStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    // Validate stock
    if (
      stock_quantity === undefined ||
      stock_quantity === null ||
      stock_quantity === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity is required",
      });
    }

    if (!Number.isInteger(Number(stock_quantity))) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a whole number",
      });
    }

    if (Number(stock_quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity cannot be negative",
      });
    }

    // Check variant
    const existingVariant =
      await productVariantModel.getVariantById(id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    await productVariantModel.updateVariantStock(
      id,
      Number(stock_quantity)
    );

    const updatedVariant =
      await productVariantModel.getVariantById(id);

    return res.status(200).json({
      success: true,
      message: "Variant stock updated successfully",
      variant: updatedVariant,
    });
  } catch (error) {
    console.error(
      "Update variant stock error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE STATUS
const updateVariantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    const existingVariant =
      await productVariantModel.getVariantById(id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    await productVariantModel.updateVariantStatus(
      id,
      status
    );

    const updatedVariant =
      await productVariantModel.getVariantById(id);

    return res.status(200).json({
      success: true,
      message: `Variant ${status.toLowerCase()} successfully`,
      variant: updatedVariant,
    });
  } catch (error) {
    console.error(
      "Update variant status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE VARIANT
const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVariant =
      await productVariantModel.getVariantById(id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    await productVariantModel.deleteVariant(id);

    return res.status(200).json({
      success: true,
      message: "Product variant deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product variant error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createVariant,
  getVariantsByProductId,
  getVariantById,
  updateVariant,
  updateVariantStock,
  updateVariantStatus,
  deleteVariant,
};
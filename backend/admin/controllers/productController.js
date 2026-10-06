const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

// =====================================================
// CREATE PRODUCT
// =====================================================
const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      brand,
      short_description,
      description,
      mrp,
      selling_price,
      material,
      wood_type,
      length,
      width,
      height,
      weight,
      seating_capacity,
      assembly_required,
      delivery_days,
    } = req.body;

    // =================================================
    // CATEGORY REQUIRED
    // =================================================
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // =================================================
    // NAME REQUIRED
    // =================================================
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // =================================================
    // MRP REQUIRED
    // =================================================
    if (
      mrp === undefined ||
      mrp === null ||
      mrp === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "MRP is required",
      });
    }

    // =================================================
    // SELLING PRICE REQUIRED
    // =================================================
    if (
      selling_price === undefined ||
      selling_price === null ||
      selling_price === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Selling price is required",
      });
    }

    // =================================================
    // MAIN IMAGE REQUIRED
    // =================================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Main product image is required",
      });
    }

    // =================================================
    // PRICE VALIDATION
    // =================================================
    if (
      Number.isNaN(Number(mrp)) ||
      Number.isNaN(Number(selling_price))
    ) {
      return res.status(400).json({
        success: false,
        message: "MRP and selling price must be valid numbers",
      });
    }

    if (Number(mrp) < 0 || Number(selling_price) < 0) {
      return res.status(400).json({
        success: false,
        message: "MRP and selling price cannot be negative",
      });
    }

    if (Number(selling_price) > Number(mrp)) {
      return res.status(400).json({
        success: false,
        message: "Selling price cannot be greater than MRP",
      });
    }

    // =================================================
    // ASSEMBLY VALIDATION
    // =================================================
    if (
      assembly_required !== undefined &&
      !["YES", "NO"].includes(assembly_required)
    ) {
      return res.status(400).json({
        success: false,
        message: "Assembly required must be YES or NO",
      });
    }

    // =================================================
    // DELIVERY DAYS VALIDATION
    // =================================================
    const deliveryDays =
      delivery_days === undefined ||
      delivery_days === null ||
      delivery_days === ""
        ? 6
        : Number(delivery_days);

    if (
      !Number.isInteger(deliveryDays) ||
      deliveryDays < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery days must be a whole number greater than 0",
      });
    }

    // =================================================
    // CHECK CATEGORY
    // =================================================
    const category =
      await categoryModel.getCategoryById(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // =================================================
    // CATEGORY MUST BE ACTIVE
    // =================================================
    if (category.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot create product under an inactive category",
      });
    }

    // =================================================
    // IMAGE PATH
    // =================================================
    const mainImage =
      `/uploads/products/${req.file.filename}`;

    // =================================================
    // CREATE PRODUCT
    // =================================================
    const productId =
      await productModel.createProduct({
        category_id,
        name: name.trim(),
        brand,
        main_image: mainImage,
        short_description,
        description,
        mrp,
        selling_price,
        material,
        wood_type,
        length,
        width,
        height,
        weight,
        seating_capacity,
        assembly_required,
        delivery_days: deliveryDays,
      });

    // =================================================
    // GET CREATED PRODUCT
    // =================================================
    const product =
      await productModel.getProductById(productId);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================
const getAllProducts = async (req, res) => {
  try {
    const products =
      await productModel.getAllProducts();

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get all products error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET PRODUCT BY ID
// =====================================================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    const product =
      await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      name,
      brand,
      short_description,
      description,
      mrp,
      selling_price,
      material,
      wood_type,
      length,
      width,
      height,
      weight,
      seating_capacity,
      assembly_required,
      delivery_days,
    } = req.body;

    // =================================================
    // CHECK EXISTING PRODUCT
    // =================================================
    const existingProduct =
      await productModel.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =================================================
    // CATEGORY REQUIRED
    // =================================================
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // =================================================
    // NAME REQUIRED
    // =================================================
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // =================================================
    // MRP REQUIRED
    // =================================================
    if (
      mrp === undefined ||
      mrp === null ||
      mrp === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "MRP is required",
      });
    }

    // =================================================
    // SELLING PRICE REQUIRED
    // =================================================
    if (
      selling_price === undefined ||
      selling_price === null ||
      selling_price === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Selling price is required",
      });
    }

    // =================================================
    // PRICE VALIDATION
    // =================================================
    if (
      Number.isNaN(Number(mrp)) ||
      Number.isNaN(Number(selling_price))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "MRP and selling price must be valid numbers",
      });
    }

    if (
      Number(mrp) < 0 ||
      Number(selling_price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "MRP and selling price cannot be negative",
      });
    }

    if (Number(selling_price) > Number(mrp)) {
      return res.status(400).json({
        success: false,
        message:
          "Selling price cannot be greater than MRP",
      });
    }

    // =================================================
    // ASSEMBLY VALIDATION
    // =================================================
    if (
      assembly_required !== undefined &&
      !["YES", "NO"].includes(assembly_required)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Assembly required must be YES or NO",
      });
    }

    // =================================================
    // DELIVERY DAYS VALIDATION
    // =================================================
    const deliveryDays =
      delivery_days === undefined ||
      delivery_days === null ||
      delivery_days === ""
        ? existingProduct.delivery_days || 6
        : Number(delivery_days);

    if (
      !Number.isInteger(deliveryDays) ||
      deliveryDays < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery days must be a whole number greater than 0",
      });
    }

    // =================================================
    // CHECK CATEGORY
    // =================================================
    const category =
      await categoryModel.getCategoryById(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // =================================================
    // CATEGORY MUST BE ACTIVE
    // =================================================
    if (category.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot assign product to an inactive category",
      });
    }

    // =================================================
    // OPTIONAL NEW MAIN IMAGE
    // =================================================
    const mainImage = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    // =================================================
    // UPDATE PRODUCT
    // =================================================
    await productModel.updateProduct(id, {
      category_id,
      name: name.trim(),
      brand,
      main_image: mainImage,
      short_description,
      description,
      mrp,
      selling_price,
      material,
      wood_type,
      length,
      width,
      height,
      weight,
      seating_capacity,
      assembly_required,
      delivery_days: deliveryDays,
    });

    // =================================================
    // GET UPDATED PRODUCT
    // =================================================
    const updatedProduct =
      await productModel.getProductById(id);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// UPDATE PRODUCT STATUS
// =====================================================
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // =================================================
    // VALIDATE STATUS
    // =================================================
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be ACTIVE or INACTIVE",
      });
    }

    // =================================================
    // CHECK PRODUCT
    // =================================================
    const existingProduct =
      await productModel.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.updateProductStatus(
      id,
      status
    );

    const updatedProduct =
      await productModel.getProductById(id);

    return res.status(200).json({
      success: true,
      message:
        `Product ${status.toLowerCase()} successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Update product status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// DELETE PRODUCT
// =====================================================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // =================================================
    // CHECK PRODUCT
    // =================================================
    const existingProduct =
      await productModel.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
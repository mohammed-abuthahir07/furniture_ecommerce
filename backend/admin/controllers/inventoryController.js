const {
  getAllInventory,
  getInventorySummary,
  getLowStockInventory,
  getOutOfStockInventory,
  getInventoryByProduct,
  getVariantById,
  updateVariantStock,
} = require("../models/inventoryModel");


// ============================================================
// GET ALL INVENTORY
// ============================================================

const getInventory = async (req, res) => {
  try {
    const inventory = await getAllInventory();

    return res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};


// ============================================================
// GET INVENTORY SUMMARY
// ============================================================

const getInventorySummaryController = async (req, res) => {
  try {
    const summary = await getInventorySummary();

    return res.status(200).json({
      success: true,
      message: "Inventory summary fetched successfully",
      summary,
    });
  } catch (error) {
    console.error("Get inventory summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory summary",
    });
  }
};


// ============================================================
// GET LOW STOCK INVENTORY
// ============================================================

const getLowStock = async (req, res) => {
  try {
    const inventory = await getLowStockInventory();

    return res.status(200).json({
      success: true,
      message: "Low stock inventory fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error("Get low stock inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch low stock inventory",
    });
  }
};


// ============================================================
// GET OUT OF STOCK INVENTORY
// ============================================================

const getOutOfStock = async (req, res) => {
  try {
    const inventory = await getOutOfStockInventory();

    return res.status(200).json({
      success: true,
      message: "Out of stock inventory fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error("Get out of stock inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch out of stock inventory",
    });
  }
};


// ============================================================
// GET INVENTORY BY PRODUCT
// ============================================================

const getProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    const inventory = await getInventoryByProduct(productId);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product inventory fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error("Get product inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product inventory",
    });
  }
};


// ============================================================
// UPDATE VARIANT STOCK
// ============================================================

const updateStock = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { stock_quantity } = req.body;

    // ----------------------------------------------------------
    // VALIDATE VARIANT ID
    // ----------------------------------------------------------

    if (!variantId || isNaN(variantId)) {
      return res.status(400).json({
        success: false,
        message: "Valid variant ID is required",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE STOCK
    // ----------------------------------------------------------

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

    const stockNumber = Number(stock_quantity);

    if (!Number.isInteger(stockNumber)) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a whole number",
      });
    }

    if (stockNumber < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity cannot be negative",
      });
    }

    // ----------------------------------------------------------
    // CHECK VARIANT
    // ----------------------------------------------------------

    const variant = await getVariantById(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    // ----------------------------------------------------------
    // UPDATE STOCK
    // ----------------------------------------------------------

    await updateVariantStock(
      variantId,
      stockNumber
    );

    // ----------------------------------------------------------
    // GET UPDATED VARIANT
    // ----------------------------------------------------------

    const updatedVariant = await getVariantById(
      variantId
    );

    // ----------------------------------------------------------
    // CALCULATE AVAILABILITY
    // ----------------------------------------------------------

    let availabilityStatus;

    if (updatedVariant.status === "INACTIVE") {
      availabilityStatus = "INACTIVE";
    } else if (updatedVariant.stock_quantity === 0) {
      availabilityStatus = "SOLD OUT";
    } else if (
      updatedVariant.stock_quantity >= 1 &&
      updatedVariant.stock_quantity <= 5
    ) {
      availabilityStatus = "LOW STOCK";
    } else {
      availabilityStatus = "AVAILABLE";
    }

    return res.status(200).json({
      success: true,
      message: "Variant stock updated successfully",

      inventory: {
        ...updatedVariant,
        availability_status: availabilityStatus,
      },
    });
  } catch (error) {
    console.error("Update variant stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update variant stock",
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getInventory,
  getInventorySummaryController,
  getLowStock,
  getOutOfStock,
  getProductInventory,
  updateStock,
};
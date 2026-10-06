const {
  getAnalyticsSummary,
  getSalesAnalytics,
  getRevenueAnalytics,
  getOrdersAnalytics,
  getProductsAnalytics,
  getBestSellingProductsAnalytics,
  getCategoriesAnalytics,
  getCustomersAnalytics,
  getPaymentsAnalytics,
  getInventoryAnalytics,
  getBestSellingCategoriesAnalytics,
} = require("../models/analyticsModel");


// ============================================================
// DATE VALIDATION
// ============================================================

const validateDateRange = (from, to) => {
  if (!from || !to) {
    return {
      valid: false,
      message: "Both from and to dates are required",
    };
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(from) || !datePattern.test(to)) {
    return {
      valid: false,
      message: "Invalid date format. Use YYYY-MM-DD",
    };
  }

  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);

  if (
    Number.isNaN(fromDate.getTime()) ||
    Number.isNaN(toDate.getTime())
  ) {
    return {
      valid: false,
      message: "Invalid date",
    };
  }

  if (fromDate > toDate) {
    return {
      valid: false,
      message: "From date cannot be greater than to date",
    };
  }

  return {
    valid: true,
  };
};


// ============================================================
// SUMMARY
// ============================================================

const analyticsSummary = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const summary = await getAnalyticsSummary(from, to);

    return res.status(200).json({
      success: true,
      message: "Analytics summary fetched successfully",
      date_range: {
        from,
        to,
      },
      summary,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics summary",
    });
  }
};


// ============================================================
// SALES
// ============================================================

const salesAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const sales = await getSalesAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Sales analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: sales.length,
      sales,
    });
  } catch (error) {
    console.error("Sales analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales analytics",
    });
  }
};


// ============================================================
// REVENUE
// ============================================================

const revenueAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const revenue = await getRevenueAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Revenue analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      revenue,
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics",
    });
  }
};


// ============================================================
// ORDERS
// ============================================================

const ordersAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const orders = await getOrdersAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Orders analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Orders analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders analytics",
    });
  }
};


// ============================================================
// PRODUCTS
// ============================================================

const productsAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const products = await getProductsAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Products analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      products,
    });
  } catch (error) {
    console.error("Products analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products analytics",
    });
  }
};


// ============================================================
// BEST SELLING PRODUCTS
// ============================================================

const bestSellingProductsAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const products =
      await getBestSellingProductsAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Best selling products analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Best selling products analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch best selling products analytics",
    });
  }
};


// ============================================================
// CATEGORIES
// ============================================================

const categoriesAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const categories =
      await getCategoriesAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Categories analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Categories analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories analytics",
    });
  }
};


// ============================================================
// CUSTOMERS
// ============================================================

const customersAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const customers =
      await getCustomersAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Customers analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      customers,
    });
  } catch (error) {
    console.error("Customers analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers analytics",
    });
  }
};


// ============================================================
// PAYMENTS
// ============================================================

const paymentsAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const payments =
      await getPaymentsAnalytics(from, to);

    return res.status(200).json({
      success: true,
      message: "Payments analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Payments analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments analytics",
    });
  }
};


// ============================================================
// INVENTORY
// ============================================================

const inventoryAnalytics = async (req, res) => {
  try {
    const inventory =
      await getInventoryAnalytics();

    return res.status(200).json({
      success: true,
      message: "Inventory analytics fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error("Inventory analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory analytics",
    });
  }
};


// ============================================================
// BEST SELLING CATEGORIES
// ============================================================

const bestSellingCategoriesAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const categories =
      await getBestSellingCategoriesAnalytics(
        from,
        to
      );

    return res.status(200).json({
      success: true,
      message:
        "Best selling categories analytics fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Best selling categories analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch best selling categories analytics",
    });
  }
};


module.exports = {
  analyticsSummary,
  salesAnalytics,
  revenueAnalytics,
  ordersAnalytics,
  productsAnalytics,
  bestSellingProductsAnalytics,
  categoriesAnalytics,
  customersAnalytics,
  paymentsAnalytics,
  inventoryAnalytics,
  bestSellingCategoriesAnalytics,
};
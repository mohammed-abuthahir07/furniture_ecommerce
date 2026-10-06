const {
  getSalesReport,
  getOrdersReport,
  getProductsReport,
  getCustomersReport,
  getInventoryReport,
  getPaymentsReport,
  getCategoriesReport,
} = require("../models/reportModel");


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

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (
    Number.isNaN(fromDate.getTime()) ||
    Number.isNaN(toDate.getTime())
  ) {
    return {
      valid: false,
      message: "Invalid date format. Use YYYY-MM-DD",
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
// SALES REPORT
// ============================================================

const salesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const report = await getSalesReport(from, to);

    return res.status(200).json({
      success: true,
      message: "Sales report fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Sales report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales report",
    });
  }
};


// ============================================================
// ORDERS REPORT
// ============================================================

const ordersReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const report = await getOrdersReport(from, to);

    return res.status(200).json({
      success: true,
      message: "Orders report fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Orders report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders report",
    });
  }
};


// ============================================================
// PRODUCTS REPORT
// ============================================================

const productsReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const report = await getProductsReport(from, to);

    return res.status(200).json({
      success: true,
      message: "Products report fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Products report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products report",
    });
  }
};


// ============================================================
// CUSTOMERS REPORT
// ============================================================

const customersReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const report = await getCustomersReport(from, to);

    return res.status(200).json({
      success: true,
      message: "Customers report fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Customers report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers report",
    });
  }
};


// ============================================================
// INVENTORY REPORT
// ============================================================

const inventoryReport = async (req, res) => {
  try {
    const report = await getInventoryReport();

    return res.status(200).json({
      success: true,
      message: "Inventory report fetched successfully",
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Inventory report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory report",
    });
  }
};


// ============================================================
// PAYMENTS REPORT
// ============================================================

const paymentsReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const report = await getPaymentsReport(from, to);

    return res.status(200).json({
      success: true,
      message: "Payments report fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Payments report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments report",
    });
  }
};


// ============================================================
// CATEGORIES REPORT
// ============================================================

const categoriesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const validation = validateDateRange(from, to);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const report = await getCategoriesReport(from, to);

    return res.status(200).json({
      success: true,
      message: "Categories report fetched successfully",
      date_range: {
        from,
        to,
      },
      total_records: report.length,
      report,
    });
  } catch (error) {
    console.error("Categories report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories report",
    });
  }
};


module.exports = {
  salesReport,
  ordersReport,
  productsReport,
  customersReport,
  inventoryReport,
  paymentsReport,
  categoriesReport,
};
const {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerOrders,
} = require("../models/customerModel");


// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};


// GET CUSTOMER BY ID
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid customer ID is required",
      });
    }

    const customer = await getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer fetched successfully",
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};


// UPDATE CUSTOMER STATUS
const changeCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid customer ID is required",
      });
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    const customer = await getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await updateCustomerStatus(id, status);

    const updatedCustomer = await getCustomerById(id);

    return res.status(200).json({
      success: true,
      message: `Customer status changed to ${status}`,
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update customer status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer status",
    });
  }
};


// GET CUSTOMER ORDER HISTORY
const getCustomerOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid customer ID is required",
      });
    }

    const customer = await getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const orders = await getCustomerOrders(id);

    return res.status(200).json({
      success: true,
      message: "Customer order history fetched successfully",

      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        total_orders: customer.total_orders,
        total_amount_spent: customer.total_amount_spent,
        last_order_date: customer.last_order_date,
        created_at: customer.created_at,
      },

      orders,
    });
  } catch (error) {
    console.error("Get customer order history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer order history",
    });
  }
};


module.exports = {
  getCustomers,
  getCustomer,
  changeCustomerStatus,
  getCustomerOrderHistory,
};
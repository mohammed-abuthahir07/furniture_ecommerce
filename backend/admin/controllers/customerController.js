const bcrypt = require("bcryptjs");

const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  getCustomerOrders,
} = require("../models/customerModel");


// CREATE CUSTOMER
const createCustomerController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Customer password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingCustomers = await getAllCustomers();

    const emailExists = existingCustomers.some(
      (customer) =>
        customer.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Customer email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customerId = await createCustomer({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || null,
      password: hashedPassword,
    });

    const customer = await getCustomerById(customerId);

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });

  } catch (error) {
    console.error("Create customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};


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


// UPDATE CUSTOMER
const editCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    const existingCustomer = await getCustomerById(id);

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const allCustomers = await getAllCustomers();

    const emailExists = allCustomers.some(
      (customer) =>
        customer.id !== Number(id) &&
        customer.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Another customer already uses this email",
      });
    }

    await updateCustomer(id, {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || null,
    });

    const updatedCustomer = await getCustomerById(id);

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });

  } catch (error) {
    console.error("Update customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};


// UPDATE CUSTOMER STATUS
const changeCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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


// DELETE CUSTOMER
const removeCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (Number(customer.total_orders) > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Customer cannot be deleted because order history exists. Deactivate the customer instead.",
      });
    }

    await deleteCustomer(id);

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });

  } catch (error) {
    console.error("Delete customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};


// GET CUSTOMER ORDER HISTORY
const getCustomerOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;

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
  createCustomerController,
  getCustomers,
  getCustomer,
  editCustomer,
  changeCustomerStatus,
  removeCustomer,
  getCustomerOrderHistory,
};
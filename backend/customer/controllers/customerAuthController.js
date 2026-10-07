const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  findCustomerByEmail,
  findCustomerById,
  createCustomer
} = require("../models/customerAuthModel");


/*
|--------------------------------------------------------------------------
| CUSTOMER REGISTER
|--------------------------------------------------------------------------
*/

const registerCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirm_password
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | REQUIRED FIELDS
    |--------------------------------------------------------------------------
    */

    if (
      !name ||
      !email ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and confirm password are required"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | NAME VALIDATION
    |--------------------------------------------------------------------------
    */

    const customerName = name.trim();

    if (customerName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters"
      });
    }

    if (customerName.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 150 characters"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | EMAIL VALIDATION
    |--------------------------------------------------------------------------
    */

    const customerEmail = email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | PHONE VALIDATION
    |--------------------------------------------------------------------------
    */

    let customerPhone = null;

    if (phone !== undefined && phone !== null) {
      customerPhone = String(phone).trim();

      if (customerPhone !== "") {
        const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

        if (!phoneRegex.test(customerPhone)) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid phone number"
          });
        }
      } else {
        customerPhone = null;
      }
    }


    /*
    |--------------------------------------------------------------------------
    | PASSWORD VALIDATION
    |--------------------------------------------------------------------------
    */

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters"
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter"
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one lowercase letter"
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one number"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | CONFIRM PASSWORD
    |--------------------------------------------------------------------------
    */

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK EXISTING CUSTOMER
    |--------------------------------------------------------------------------
    */

    const existingCustomer =
      await findCustomerByEmail(customerEmail);

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | HASH PASSWORD
    |--------------------------------------------------------------------------
    */

    const hashedPassword =
      await bcrypt.hash(password, 10);


    /*
    |--------------------------------------------------------------------------
    | CREATE CUSTOMER
    |--------------------------------------------------------------------------
    */

    const customerId = await createCustomer({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      password: hashedPassword
    });


    /*
    |--------------------------------------------------------------------------
    | CREATE JWT
    |--------------------------------------------------------------------------
    */

    const token = jwt.sign(
      {
        id: customerId,
        role: "CUSTOMER"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    /*
    |--------------------------------------------------------------------------
    | GET CREATED CUSTOMER
    |--------------------------------------------------------------------------
    */

    const customer =
      await findCustomerById(customerId);


    return res.status(201).json({
      success: true,
      message:
        "Customer registered successfully",

      token,

      customer
    });

  } catch (error) {
    console.error(
      "Customer registration error:",
      error
    );


    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists"
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Failed to register customer"
    });
  }
};


/*
|--------------------------------------------------------------------------
| CUSTOMER LOGIN
|--------------------------------------------------------------------------
*/

const loginCustomer = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | REQUIRED FIELDS
    |--------------------------------------------------------------------------
    */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }


    const customerEmail =
      email.trim().toLowerCase();


    /*
    |--------------------------------------------------------------------------
    | FIND CUSTOMER
    |--------------------------------------------------------------------------
    */

    const customer =
      await findCustomerByEmail(customerEmail);


    if (!customer) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK ACCOUNT STATUS
    |--------------------------------------------------------------------------
    */

    if (customer.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact support."
      });
    }


    /*
    |--------------------------------------------------------------------------
    | VERIFY PASSWORD
    |--------------------------------------------------------------------------
    */

    const passwordMatch =
      await bcrypt.compare(
        password,
        customer.password
      );


    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE JWT
    |--------------------------------------------------------------------------
    */

    const token = jwt.sign(
      {
        id: customer.id,
        role: "CUSTOMER"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    /*
    |--------------------------------------------------------------------------
    | REMOVE PASSWORD FROM RESPONSE
    |--------------------------------------------------------------------------
    */

    delete customer.password;


    return res.status(200).json({
      success: true,
      message:
        "Customer login successful",

      token,

      customer
    });

  } catch (error) {
    console.error(
      "Customer login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to login customer"
    });
  }
};


/*
|--------------------------------------------------------------------------
| CUSTOMER PROFILE
|--------------------------------------------------------------------------
*/

const getCustomerProfile = async (req, res) => {
  try {
    const customerId =
      req.customer.id;


    const customer =
      await findCustomerById(customerId);


    if (!customer) {
      return res.status(404).json({
        success: false,
        message:
          "Customer account not found"
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Customer profile fetched successfully",

      customer
    });

  } catch (error) {
    console.error(
      "Get customer profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customer profile"
    });
  }
};


module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile
};
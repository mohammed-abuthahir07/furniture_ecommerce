const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const {
  findCustomerByEmail,
  findCustomerByGoogleId,
  findCustomerById,
  createCustomer,
  updateCustomerGoogleId
} = require("../models/customerAuthModel");


/*
|--------------------------------------------------------------------------
| GOOGLE CLIENT
|--------------------------------------------------------------------------
*/

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


/*
|--------------------------------------------------------------------------
| CREATE OUR CUSTOMER JWT
|--------------------------------------------------------------------------
*/

const createCustomerToken = (customerId) => {
  return jwt.sign(
    {
      id: customerId,
      role: "CUSTOMER"
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};


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


    const customerName = name.trim();

    if (customerName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters"
      });
    }


    if (customerName.length > 150) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot exceed 150 characters"
      });
    }


    const customerEmail =
      email.trim().toLowerCase();


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address"
      });
    }


    let customerPhone = null;


    if (
      phone !== undefined &&
      phone !== null
    ) {
      customerPhone = String(phone).trim();

      if (customerPhone !== "") {
        const phoneRegex =
          /^[0-9+\-\s()]{7,20}$/;

        if (!phoneRegex.test(customerPhone)) {
          return res.status(400).json({
            success: false,
            message:
              "Please provide a valid phone number"
          });
        }
      } else {
        customerPhone = null;
      }
    }


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


    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match"
      });
    }


    const existingCustomer =
      await findCustomerByEmail(
        customerEmail
      );


    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists"
      });
    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const customerId =
      await createCustomer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        password: hashedPassword,
        google_id: null
      });


    const token =
      createCustomerToken(customerId);


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


    if (
      error.code === "ER_DUP_ENTRY"
    ) {
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


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }


    const customerEmail =
      email.trim().toLowerCase();


    const customer =
      await findCustomerByEmail(
        customerEmail
      );


    if (!customer) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }


    if (customer.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact support."
      });
    }


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


    const token =
      createCustomerToken(customer.id);


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
| CONTINUE WITH GOOGLE
|--------------------------------------------------------------------------
*/

const googleLogin = async (req, res) => {
  try {
    const {
      id_token
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | CHECK TOKEN
    |--------------------------------------------------------------------------
    */

    if (!id_token) {
      return res.status(400).json({
        success: false,
        message:
          "Google ID token is required"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | VERIFY GOOGLE ID TOKEN
    |--------------------------------------------------------------------------
    */

    const ticket =
      await googleClient.verifyIdToken({
        idToken: id_token,
        audience:
          process.env.GOOGLE_CLIENT_ID
      });


    const payload =
      ticket.getPayload();


    if (!payload) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Google authentication token"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | GOOGLE USER INFORMATION
    |--------------------------------------------------------------------------
    */

    const googleId =
      payload.sub;

    const googleEmail =
      payload.email
        ? payload.email.toLowerCase()
        : null;

    const googleName =
      payload.name || "Google Customer";

    const emailVerified =
      payload.email_verified;


    /*
    |--------------------------------------------------------------------------
    | REQUIRE VERIFIED GOOGLE EMAIL
    |--------------------------------------------------------------------------
    */

    if (!googleEmail || !emailVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Google account email could not be verified"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | FIRST: FIND BY GOOGLE ID
    |--------------------------------------------------------------------------
    */

    let customer =
      await findCustomerByGoogleId(
        googleId
      );


    /*
    |--------------------------------------------------------------------------
    | GOOGLE CUSTOMER ALREADY EXISTS
    |--------------------------------------------------------------------------
    */

    if (customer) {

      if (customer.status !== "ACTIVE") {
        return res.status(403).json({
          success: false,
          message:
            "Your account is inactive. Please contact support."
        });
      }


      const token =
        createCustomerToken(
          customer.id
        );


      delete customer.password;


      return res.status(200).json({
        success: true,
        message:
          "Google login successful",
        token,
        customer
      });
    }


    /*
    |--------------------------------------------------------------------------
    | SECOND: FIND BY EMAIL
    |--------------------------------------------------------------------------
    |
    | If the customer already registered using
    | email/password with the same email,
    | connect the Google account to that customer.
    |
    |--------------------------------------------------------------------------
    */

    customer =
      await findCustomerByEmail(
        googleEmail
      );


    if (customer) {

      if (customer.status !== "ACTIVE") {
        return res.status(403).json({
          success: false,
          message:
            "Your account is inactive. Please contact support."
        });
      }


      /*
      |--------------------------------------------------------------------------
      | LINK GOOGLE ACCOUNT
      |--------------------------------------------------------------------------
      */

      await updateCustomerGoogleId(
        customer.id,
        googleId
      );


      const token =
        createCustomerToken(
          customer.id
        );


      const updatedCustomer =
        await findCustomerById(
          customer.id
        );


      return res.status(200).json({
        success: true,
        message:
          "Google account linked and login successful",
        token,
        customer:
          updatedCustomer
      });
    }


    /*
    |--------------------------------------------------------------------------
    | NEW GOOGLE CUSTOMER
    |--------------------------------------------------------------------------
    |
    | Existing customers have a required password.
    | Therefore we create a random unusable password
    | for Google-only accounts.
    |
    |--------------------------------------------------------------------------
    */

    const randomPassword =
      crypto.randomBytes(32).toString("hex");


    const hashedPassword =
      await bcrypt.hash(
        randomPassword,
        10
      );


    const customerId =
      await createCustomer({
        name: googleName,
        email: googleEmail,
        phone: null,
        password: hashedPassword,
        google_id: googleId
      });


    /*
    |--------------------------------------------------------------------------
    | CREATE OUR JWT
    |--------------------------------------------------------------------------
    */

    const token =
      createCustomerToken(
        customerId
      );


    const newCustomer =
      await findCustomerById(
        customerId
      );


    return res.status(201).json({
      success: true,
      message:
        "Google account registered and login successful",
      token,
      customer:
        newCustomer
    });

  } catch (error) {
    console.error(
      "Google login error:",
      error
    );


    return res.status(401).json({
      success: false,
      message:
        "Google authentication failed"
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
      await findCustomerById(
        customerId
      );


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
  googleLogin,
  getCustomerProfile
};
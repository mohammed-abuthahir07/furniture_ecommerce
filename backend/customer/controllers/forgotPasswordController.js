const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const {
  findCustomerByEmail,
  invalidateActiveOtpRequests,
  createOtpRequest,
  getLatestActiveOtpRequest,
  increaseOtpAttempts,
  markOtpVerified,
  getVerifiedResetRequest,
  updateCustomerPassword,
  markResetRequestUsed,
} = require("../models/forgotPasswordModel");

/*
|--------------------------------------------------------------------------
| EMAIL TRANSPORTER
|--------------------------------------------------------------------------
*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
|--------------------------------------------------------------------------
| GENERATE OTP
|--------------------------------------------------------------------------
*/

const generateOtp = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

/*
|--------------------------------------------------------------------------
| GENERATE RESET TOKEN
|--------------------------------------------------------------------------
*/

const generateResetToken = () => {
  return crypto
    .randomBytes(32)
    .toString("hex");
};

/*
|--------------------------------------------------------------------------
| HASH RESET TOKEN
|--------------------------------------------------------------------------
*/

const hashResetToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

/*
|--------------------------------------------------------------------------
| SEND OTP EMAIL
|--------------------------------------------------------------------------
*/

const sendOtpEmail = async (
  customerEmail,
  customerName,
  otp
) => {
  await transporter.sendMail({
    from: `"Furniture E-Commerce" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject:
      "Furniture E-Commerce - Password Reset OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      ">

        <h2>Password Reset Request</h2>

        <p>
          Hello ${customerName || "Customer"},
        </p>

        <p>
          We received a request to reset your
          Furniture E-Commerce account password.
        </p>

        <p>
          Your OTP is:
        </p>

        <div style="
          text-align: center;
          margin: 25px 0;
          padding: 20px;
          background: #f3f4f6;
          border-radius: 10px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for
          <strong>10 minutes</strong>.
        </p>

        <p>
          Maximum OTP attempts:
          <strong>5</strong>
        </p>

        <p>
          Do not share this OTP with anyone.
        </p>

        <p>
          If you did not request this password reset,
          you can safely ignore this email.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>Furniture E-Commerce Team</strong>
        </p>

      </div>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| STEP 1
| CUSTOMER ENTERS EMAIL
|--------------------------------------------------------------------------
|
| POST
| /api/customer/auth/forgot-password
|
|--------------------------------------------------------------------------
*/

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | FIND CUSTOMER
    |--------------------------------------------------------------------------
    */

    const customer =
      await findCustomerByEmail(
        normalizedEmail
      );

    /*
    |--------------------------------------------------------------------------
    | DO NOT REVEAL CUSTOMER EXISTENCE
    |--------------------------------------------------------------------------
    */

    if (
      !customer ||
      customer.status !== "ACTIVE"
    ) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, an OTP has been sent.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | INVALIDATE OLD OTP
    |--------------------------------------------------------------------------
    */

    await invalidateActiveOtpRequests(
      customer.id
    );

    /*
    |--------------------------------------------------------------------------
    | GENERATE OTP
    |--------------------------------------------------------------------------
    */

    const otp = generateOtp();

    /*
    |--------------------------------------------------------------------------
    | HASH OTP
    |--------------------------------------------------------------------------
    */

    const otpHash =
      await bcrypt.hash(
        otp,
        10
      );

    /*
    |--------------------------------------------------------------------------
    | OTP EXPIRES IN 10 MINUTES
    |--------------------------------------------------------------------------
    */

    const expiresAt =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    /*
    |--------------------------------------------------------------------------
    | SAVE OTP
    |--------------------------------------------------------------------------
    */

    await createOtpRequest({
      customerId: customer.id,
      email: normalizedEmail,
      otpHash,
      expiresAt,
    });

    /*
    |--------------------------------------------------------------------------
    | SEND OTP
    |--------------------------------------------------------------------------
    */

    await sendOtpEmail(
      customer.email,
      customer.name,
      otp
    );

    /*
    |--------------------------------------------------------------------------
    | SAVE EMAIL IN HTTP-ONLY COOKIE
    |--------------------------------------------------------------------------
    |
    | Step 2 does not need to send email in request body.
    |--------------------------------------------------------------------------
    */

    res.cookie(
      "forgot_password_email",
      normalizedEmail,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:
          10 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP has been sent to your registered email.",
    });

  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send OTP",
    });
  }
};

/*
|--------------------------------------------------------------------------
| STEP 2
| VERIFY OTP
|--------------------------------------------------------------------------
|
| Customer enters ONLY OTP.
|
| POST
| /api/customer/auth/verify-otp
|
|--------------------------------------------------------------------------
*/

const verifyOtp = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | GET EMAIL FROM HTTP-ONLY COOKIE
    |--------------------------------------------------------------------------
    */

    const email =
      req.cookies?.forgot_password_email;

    const { otp } = req.body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATE OTP
    |--------------------------------------------------------------------------
    */

    if (
      !otp ||
      !/^\d{6}$/.test(
        String(otp)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid 6-digit OTP is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset session expired. Please request a new OTP.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | GET ACTIVE OTP
    |--------------------------------------------------------------------------
    */

    const otpRecord =
      await getLatestActiveOtpRequest(
        email
      );

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTP",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | MAX ATTEMPTS
    |--------------------------------------------------------------------------
    */

    if (otpRecord.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message:
          "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK OTP EXPIRY
    |--------------------------------------------------------------------------
    */

    const now = new Date();

    const expiresAt =
      new Date(
        otpRecord.expires_at
      );

    if (now > expiresAt) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK OTP
    |--------------------------------------------------------------------------
    */

    const isOtpCorrect =
      await bcrypt.compare(
        String(otp),
        otpRecord.otp_hash
      );

    if (!isOtpCorrect) {
      await increaseOtpAttempts(
        otpRecord.id
      );

      const attemptsUsed =
        otpRecord.attempts + 1;

      const remaining =
        5 - attemptsUsed;

      return res.status(400).json({
        success: false,
        message:
          remaining > 0
            ? `Incorrect OTP. ${remaining} attempts remaining.`
            : "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | OTP CORRECT
    |--------------------------------------------------------------------------
    */

    const resetToken =
      generateResetToken();

    const resetTokenHash =
      hashResetToken(
        resetToken
      );

    /*
    |--------------------------------------------------------------------------
    | RESET TOKEN VALID FOR 10 MINUTES
    |--------------------------------------------------------------------------
    */

    const resetTokenExpiresAt =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    /*
    |--------------------------------------------------------------------------
    | MARK OTP VERIFIED
    |--------------------------------------------------------------------------
    */

    await markOtpVerified({
      otpId: otpRecord.id,
      resetTokenHash,
      resetTokenExpiresAt,
    });

    /*
    |--------------------------------------------------------------------------
    | REMOVE EMAIL COOKIE
    |--------------------------------------------------------------------------
    */

    res.clearCookie(
      "forgot_password_email",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
      }
    );

    /*
    |--------------------------------------------------------------------------
    | STORE RESET TOKEN IN HTTP-ONLY COOKIE
    |--------------------------------------------------------------------------
    */

    res.cookie(
      "password_reset_token",
      resetToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:
          10 * 60 * 1000,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully. You can now change your password.",
    });

  } catch (error) {
    console.error(
      "Verify OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify OTP",
    });
  }
};

/*
|--------------------------------------------------------------------------
| STEP 3
| CHANGE PASSWORD
|--------------------------------------------------------------------------
|
| Customer enters:
| new_password
| confirm_password
|
| POST
| /api/customer/auth/reset-password
|
|--------------------------------------------------------------------------
*/

const resetPassword = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | GET RESET TOKEN FROM HTTP-ONLY COOKIE
    |--------------------------------------------------------------------------
    */

    const resetToken =
      req.cookies?.password_reset_token;

    const {
      new_password,
      confirm_password,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | CHECK RESET SESSION
    |--------------------------------------------------------------------------
    */

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset session is invalid or expired.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE PASSWORD
    |--------------------------------------------------------------------------
    */

    if (!new_password) {
      return res.status(400).json({
        success: false,
        message:
          "New password is required",
      });
    }

    if (!confirm_password) {
      return res.status(400).json({
        success: false,
        message:
          "Confirm password is required",
      });
    }

    if (
      new_password !==
      confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | HASH RESET TOKEN
    |--------------------------------------------------------------------------
    */

    const resetTokenHash =
      hashResetToken(
        resetToken
      );

    /*
    |--------------------------------------------------------------------------
    | FIND VERIFIED RESET REQUEST
    |--------------------------------------------------------------------------
    */

    const [rows] =
      await require(
        "../../config/database"
      ).pool.execute(
        `
          SELECT
            id,
            customer_id,
            email,
            reset_token_hash,
            reset_token_expires_at,
            is_verified,
            is_used
          FROM customer_password_otps
          WHERE reset_token_hash = ?
            AND is_verified = 1
            AND is_used = 0
          LIMIT 1
        `,
        [resetTokenHash]
      );

    const resetRequest =
      rows[0];

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid password reset session.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK TOKEN EXPIRY
    |--------------------------------------------------------------------------
    */

    const now = new Date();

    const tokenExpiresAt =
      new Date(
        resetRequest.reset_token_expires_at
      );

    if (now > tokenExpiresAt) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset session has expired. Please request a new OTP.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | FIND CUSTOMER
    |--------------------------------------------------------------------------
    */

    const customer =
      await findCustomerByEmail(
        resetRequest.email
      );

    if (!customer) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid password reset request.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER MUST BE ACTIVE
    |--------------------------------------------------------------------------
    */

    if (
      customer.status !== "ACTIVE"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Customer account is inactive.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | HASH NEW PASSWORD
    |--------------------------------------------------------------------------
    */

    const hashedPassword =
      await bcrypt.hash(
        new_password,
        12
      );

    /*
    |--------------------------------------------------------------------------
    | UPDATE PASSWORD
    |--------------------------------------------------------------------------
    */

    await updateCustomerPassword(
      customer.id,
      hashedPassword
    );

    /*
    |--------------------------------------------------------------------------
    | MARK RESET SESSION USED
    |--------------------------------------------------------------------------
    */

    await markResetRequestUsed(
      resetRequest.id
    );

    /*
    |--------------------------------------------------------------------------
    | CLEAR RESET COOKIE
    |--------------------------------------------------------------------------
    */

    res.clearCookie(
      "password_reset_token",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
      }
    );

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change password",
    });
  }
};

module.exports = {
  forgotPassword,
  verifyOtp,
  resetPassword,
};
const { pool } = require("../../config/database");

/*
|--------------------------------------------------------------------------
| FIND CUSTOMER BY EMAIL
|--------------------------------------------------------------------------
*/

const findCustomerByEmail = async (email) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name,
        email,
        password,
        status
      FROM customers
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
};

/*
|--------------------------------------------------------------------------
| INVALIDATE PREVIOUS OTP REQUESTS
|--------------------------------------------------------------------------
*/

const invalidateActiveOtpRequests = async (customerId) => {
  await pool.execute(
    `
      UPDATE customer_password_otps
      SET is_used = 1
      WHERE customer_id = ?
        AND is_used = 0
    `,
    [customerId]
  );
};

/*
|--------------------------------------------------------------------------
| CREATE OTP REQUEST
|--------------------------------------------------------------------------
*/

const createOtpRequest = async ({
  customerId,
  email,
  otpHash,
  expiresAt,
}) => {
  const [result] = await pool.execute(
    `
      INSERT INTO customer_password_otps (
        customer_id,
        email,
        otp_hash,
        expires_at,
        attempts,
        is_verified,
        is_used
      )
      VALUES (?, ?, ?, ?, 0, 0, 0)
    `,
    [
      customerId,
      email,
      otpHash,
      expiresAt,
    ]
  );

  return result.insertId;
};

/*
|--------------------------------------------------------------------------
| GET LATEST ACTIVE OTP
|--------------------------------------------------------------------------
*/

const getLatestActiveOtpRequest = async (email) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        customer_id,
        email,
        otp_hash,
        expires_at,
        attempts,
        is_verified,
        is_used,
        reset_token_hash,
        reset_token_expires_at,
        created_at
      FROM customer_password_otps
      WHERE email = ?
        AND is_used = 0
      ORDER BY id DESC
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
};

/*
|--------------------------------------------------------------------------
| INCREASE OTP ATTEMPTS
|--------------------------------------------------------------------------
*/

const increaseOtpAttempts = async (otpId) => {
  await pool.execute(
    `
      UPDATE customer_password_otps
      SET attempts = attempts + 1
      WHERE id = ?
    `,
    [otpId]
  );
};

/*
|--------------------------------------------------------------------------
| MARK OTP VERIFIED
|--------------------------------------------------------------------------
*/

const markOtpVerified = async ({
  otpId,
  resetTokenHash,
  resetTokenExpiresAt,
}) => {
  await pool.execute(
    `
      UPDATE customer_password_otps
      SET
        is_verified = 1,
        reset_token_hash = ?,
        reset_token_expires_at = ?
      WHERE id = ?
    `,
    [
      resetTokenHash,
      resetTokenExpiresAt,
      otpId,
    ]
  );
};

/*
|--------------------------------------------------------------------------
| GET VERIFIED RESET REQUEST
|--------------------------------------------------------------------------
*/

const getVerifiedResetRequest = async (email) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        customer_id,
        email,
        is_verified,
        is_used,
        reset_token_hash,
        reset_token_expires_at
      FROM customer_password_otps
      WHERE email = ?
        AND is_verified = 1
        AND is_used = 0
      ORDER BY id DESC
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
};

/*
|--------------------------------------------------------------------------
| UPDATE CUSTOMER PASSWORD
|--------------------------------------------------------------------------
*/

const updateCustomerPassword = async (
  customerId,
  hashedPassword
) => {
  const [result] = await pool.execute(
    `
      UPDATE customers
      SET password = ?
      WHERE id = ?
    `,
    [
      hashedPassword,
      customerId,
    ]
  );

  return result;
};

/*
|--------------------------------------------------------------------------
| MARK RESET REQUEST USED
|--------------------------------------------------------------------------
*/

const markResetRequestUsed = async (otpId) => {
  await pool.execute(
    `
      UPDATE customer_password_otps
      SET
        is_used = 1,
        is_verified = 0,
        reset_token_hash = NULL,
        reset_token_expires_at = NULL
      WHERE id = ?
    `,
    [otpId]
  );
};

module.exports = {
  findCustomerByEmail,
  invalidateActiveOtpRequests,
  createOtpRequest,
  getLatestActiveOtpRequest,
  increaseOtpAttempts,
  markOtpVerified,
  getVerifiedResetRequest,
  updateCustomerPassword,
  markResetRequestUsed,
};
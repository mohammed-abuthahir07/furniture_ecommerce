const express = require("express");

const {
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/forgotPasswordController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| STEP 1
| EMAIL → SEND OTP
|--------------------------------------------------------------------------
*/

router.post(
  "/forgot-password",
  forgotPassword
);

/*
|--------------------------------------------------------------------------
| STEP 2
| OTP ONLY
|--------------------------------------------------------------------------
*/

router.post(
  "/verify-otp",
  verifyOtp
);

/*
|--------------------------------------------------------------------------
| STEP 3
| NEW PASSWORD
|--------------------------------------------------------------------------
*/

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;
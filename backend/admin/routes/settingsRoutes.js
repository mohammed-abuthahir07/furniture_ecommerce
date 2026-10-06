const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| ADMIN PROFILE
|--------------------------------------------------------------------------
*/

// GET ADMIN PROFILE
router.get(
  "/profile",
  adminAuthMiddleware,
  getProfile
);

// UPDATE ADMIN PROFILE
router.put(
  "/profile",
  adminAuthMiddleware,
  updateProfile
);


/*
|--------------------------------------------------------------------------
| SECURITY
|--------------------------------------------------------------------------
*/

// CHANGE ADMIN PASSWORD
router.put(
  "/change-password",
  adminAuthMiddleware,
  changePassword
);


/*
|--------------------------------------------------------------------------
| SHIPPING / DELIVERY / PAYMENT SETTINGS
|--------------------------------------------------------------------------
*/

// GET SETTINGS
router.get(
  "/store",
  adminAuthMiddleware,
  getSettings
);

// UPDATE SETTINGS
router.put(
  "/store",
  adminAuthMiddleware,
  updateSettings
);


module.exports = router;
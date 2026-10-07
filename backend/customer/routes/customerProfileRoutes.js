const express = require("express");

const {
  getProfile,
  updateProfile
} = require("../controllers/customerProfileController");

const customerAuthMiddleware =
  require("../../middleware/customerAuthMiddleware");

const customerProfileUpload =
  require("../../middleware/customerProfileUploadMiddleware");

const router = express.Router();

/*
  Get logged-in customer's own profile
*/
router.get(
  "/",
  customerAuthMiddleware,
  getProfile
);

/*
  Update logged-in customer's profile
  Supports:
  - name
  - profile_image
*/
router.put(
  "/",
  customerAuthMiddleware,
  customerProfileUpload.single("profile_image"),
  updateProfile
);

module.exports = router;
const express = require("express");

const {
  adminLogin,
  adminGetProfile,
} = require("../controllers/adminAuthController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/login", adminLogin);

router.get(
  "/profile",
  adminAuthMiddleware,
  adminGetProfile
);

module.exports = router;
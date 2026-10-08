const express = require("express");

const {
  getAllRequirements,
  getRequirementById,
} = require("../controllers/customRequirementController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

// Admin only - get all custom requirements
router.get(
  "/",
  adminAuthMiddleware,
  getAllRequirements
);

// Admin only - get one custom requirement
router.get(
  "/:id",
  adminAuthMiddleware,
  getRequirementById
);

module.exports = router;
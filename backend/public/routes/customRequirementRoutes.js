const express = require("express");

const {
  createRequirement,
} = require("../controllers/customRequirementController");

const upload = require("../../middleware/customRequirementUploadMiddleware");

const router = express.Router();

router.post(
  "/",
  upload.single("reference_image"),
  createRequirement
);

module.exports = router;
const {
  getAllCustomRequirements,
  getCustomRequirementById,
} = require("../models/customRequirementModel");

// Get all custom requirements
const getAllRequirements = async (req, res) => {
  try {
    const requirements = await getAllCustomRequirements();

    return res.status(200).json({
      success: true,
      message: "Custom requirements fetched successfully",
      data: requirements,
    });
  } catch (error) {
    console.error(
      "Get all custom requirements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch custom requirements",
    });
  }
};

// Get one custom requirement
const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid requirement ID",
      });
    }

    const requirement =
      await getCustomRequirementById(Number(id));

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Custom requirement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Custom requirement fetched successfully",
      data: requirement,
    });
  } catch (error) {
    console.error(
      "Get custom requirement by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch custom requirement",
    });
  }
};

module.exports = {
  getAllRequirements,
  getRequirementById,
};
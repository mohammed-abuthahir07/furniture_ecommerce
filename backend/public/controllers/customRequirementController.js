const {
  createCustomRequirement,
  getCustomRequirements,
  getCustomRequirementById,
} = require("../models/customRequirementModel");

const createRequirement = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      alternative_address,
      requirement,
    } = req.body;

    // Required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!requirement || !requirement.trim()) {
      return res.status(400).json({
        success: false,
        message: "Requirement is required",
      });
    }

    // Optional logged-in customer
    const customerId = req.customer?.id || null;

    // Optional reference image
    const referenceImage = req.file
      ? `/uploads/custom-requirements/${req.file.filename}`
      : null;

    const requirementId = await createCustomRequirement({
      customer_id: customerId,
      name: name.trim(),
      email: email ? email.trim() : null,
      phone: phone.trim(),
      address: address.trim(),
      city: city ? city.trim() : null,
      state: state ? state.trim() : null,
      pincode: pincode ? pincode.trim() : null,
      alternative_address: alternative_address
        ? alternative_address.trim()
        : null,
      requirement: requirement.trim(),
      reference_image: referenceImage,
    });

    const savedRequirement =
      await getCustomRequirementById(requirementId);

    return res.status(201).json({
      success: true,
      message: "Custom requirement submitted successfully",
      data: savedRequirement,
    });

  } catch (error) {
    console.error(
      "Create custom requirement error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to submit custom requirement",
    });
  }
};


// Admin view all submitted requirements
const getAllRequirements = async (req, res) => {
  try {
    const requirements = await getCustomRequirements();

    return res.status(200).json({
      success: true,
      message: "Custom requirements fetched successfully",
      data: requirements,
    });

  } catch (error) {
    console.error(
      "Get custom requirements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch custom requirements",
    });
  }
};


// Admin view one requirement
const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;

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
  createRequirement,
  getAllRequirements,
  getRequirementById,
};
const {
  getCustomerProfileById,
  updateCustomerProfile
} = require("../models/customerProfileModel");

const getProfile = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const customer = await getCustomerProfileById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer profile fetched successfully",
      customer
    });
  } catch (error) {
    console.error("Get customer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer profile"
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters"
      });
    }

    if (trimmedName.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 150 characters"
      });
    }

    const currentCustomer = await getCustomerProfileById(customerId);

    if (!currentCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found"
      });
    }

    /*
      If a new image was uploaded, use the new image path.
      Otherwise keep the existing profile image.
    */
    const profileImage = req.file
      ? `/uploads/customers/${req.file.filename}`
      : currentCustomer.profile_image;

    await updateCustomerProfile({
      customerId,
      name: trimmedName,
      profileImage
    });

    const updatedCustomer =
      await getCustomerProfileById(customerId);

    return res.status(200).json({
      success: true,
      message: "Customer profile updated successfully",
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("Update customer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer profile"
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
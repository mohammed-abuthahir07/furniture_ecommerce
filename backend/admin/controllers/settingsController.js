const bcrypt = require("bcryptjs");

const {
  getAdminProfile,
  getAdminByEmail,
  updateAdminProfile,

  getAdminPassword,
  updateAdminPassword,

  getStoreSettings,
  createStoreSettings,
  updateStoreSettings,
} = require("../models/settingsModel");


/*
|--------------------------------------------------------------------------
| GET ADMIN PROFILE
|--------------------------------------------------------------------------
*/

const getProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const profile = await getAdminProfile(adminId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "Get admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE ADMIN PROFILE
|--------------------------------------------------------------------------
*/

const updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    let {
      name,
      email,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Required validation
    |--------------------------------------------------------------------------
    */

    if (
      name === undefined ||
      name === null ||
      name.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin name is required",
      });
    }

    if (
      email === undefined ||
      email === null ||
      email.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin email is required",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Name validation
    |--------------------------------------------------------------------------
    */

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Admin name must contain at least 2 characters",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Admin name cannot exceed 100 characters",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Email validation
    |--------------------------------------------------------------------------
    */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate email
    |--------------------------------------------------------------------------
    */

    const existingAdmin =
      await getAdminByEmail(email);

    if (
      existingAdmin &&
      Number(existingAdmin.id) !== Number(adminId)
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Email address is already in use",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    await updateAdminProfile(
      adminId,
      name,
      email
    );

    const updatedProfile =
      await getAdminProfile(adminId);

    return res.status(200).json({
      success: true,
      message:
        "Admin profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(
      "Update admin profile error:",
      error
    );

    if (
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Email address is already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update admin profile",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CHANGE ADMIN PASSWORD
|--------------------------------------------------------------------------
*/

const changePassword = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const {
      current_password,
      new_password,
      confirm_password,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Required validation
    |--------------------------------------------------------------------------
    */

    if (
      !current_password ||
      !new_password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password, new password and confirm password are required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Confirm password
    |--------------------------------------------------------------------------
    */

    if (
      new_password !== confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Password length
    |--------------------------------------------------------------------------
    */

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least 8 characters",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Password strength
    |--------------------------------------------------------------------------
    */

    if (
      !/[A-Z]/.test(new_password) ||
      !/[a-z]/.test(new_password) ||
      !/[0-9]/.test(new_password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least one uppercase letter, one lowercase letter and one number",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent same password
    |--------------------------------------------------------------------------
    */

    if (
      new_password === current_password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get current password
    |--------------------------------------------------------------------------
    */

    const adminPassword =
      await getAdminPassword(adminId);

    if (!adminPassword) {
      return res.status(404).json({
        success: false,
        message:
          "Admin account not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verify current password
    |--------------------------------------------------------------------------
    */

    const passwordMatches =
      await bcrypt.compare(
        current_password,
        adminPassword.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update password
    |--------------------------------------------------------------------------
    */

    await updateAdminPassword(
      adminId,
      new_password
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change admin password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to change admin password",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET SHIPPING / DELIVERY / PAYMENT SETTINGS
|--------------------------------------------------------------------------
*/

const getSettings = async (req, res) => {
  try {
    let settings =
      await getStoreSettings();

    /*
    |--------------------------------------------------------------------------
    | Create default settings if table is empty
    |--------------------------------------------------------------------------
    */

    if (!settings) {
      await createStoreSettings({
        shipping_charge: 499.00,
        free_shipping_threshold: 10000.00,
        default_delivery_days: 6,
        cod_enabled: 1,
        online_payment_enabled: 1,
      });

      settings =
        await getStoreSettings();
    }

    return res.status(200).json({
      success: true,
      message:
        "Settings fetched successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "Get settings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch settings",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE SHIPPING / DELIVERY / PAYMENT SETTINGS
|--------------------------------------------------------------------------
*/

const updateSettings = async (req, res) => {
  try {
    let {
      shipping_charge,
      free_shipping_threshold,
      default_delivery_days,
      cod_enabled,
      online_payment_enabled,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Required values
    |--------------------------------------------------------------------------
    */

    if (
      shipping_charge === undefined ||
      shipping_charge === null ||
      shipping_charge === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping charge is required",
      });
    }

    if (
      free_shipping_threshold === undefined ||
      free_shipping_threshold === null ||
      free_shipping_threshold === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Free shipping threshold is required",
      });
    }

    if (
      default_delivery_days === undefined ||
      default_delivery_days === null ||
      default_delivery_days === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Default delivery days is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Convert numeric values
    |--------------------------------------------------------------------------
    */

    shipping_charge =
      Number(shipping_charge);

    free_shipping_threshold =
      Number(
        free_shipping_threshold
      );

    default_delivery_days =
      Number(
        default_delivery_days
      );

    /*
    |--------------------------------------------------------------------------
    | Validate shipping charge
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isFinite(
        shipping_charge
      ) ||
      shipping_charge < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping charge must be a valid non-negative number",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate free shipping threshold
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isFinite(
        free_shipping_threshold
      ) ||
      free_shipping_threshold < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Free shipping threshold must be a valid non-negative number",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate default delivery days
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(
        default_delivery_days
      ) ||
      default_delivery_days < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Default delivery days must be a whole number greater than 0",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate COD
    |--------------------------------------------------------------------------
    */

    const validCodValues = [
      true,
      false,
      0,
      1,
    ];

    if (
      !validCodValues.includes(
        cod_enabled
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "COD enabled value must be true or false",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Online Payment
    |--------------------------------------------------------------------------
    */

    const validOnlinePaymentValues = [
      true,
      false,
      0,
      1,
    ];

    if (
      !validOnlinePaymentValues.includes(
        online_payment_enabled
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Online payment enabled value must be true or false",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Convert boolean values to MySQL 0/1
    |--------------------------------------------------------------------------
    */

    cod_enabled =
      cod_enabled === true ||
      cod_enabled === 1
        ? 1
        : 0;

    online_payment_enabled =
      online_payment_enabled === true ||
      online_payment_enabled === 1
        ? 1
        : 0;

    /*
    |--------------------------------------------------------------------------
    | At least one payment method must remain enabled
    |--------------------------------------------------------------------------
    */

    if (
      cod_enabled === 0 &&
      online_payment_enabled === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one payment method must be enabled",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get current settings
    |--------------------------------------------------------------------------
    */

    let settings =
      await getStoreSettings();

    /*
    |--------------------------------------------------------------------------
    | Create if no settings exist
    |--------------------------------------------------------------------------
    */

    if (!settings) {
      await createStoreSettings({
        shipping_charge,
        free_shipping_threshold,
        default_delivery_days,
        cod_enabled,
        online_payment_enabled,
      });
    } else {
      /*
      |--------------------------------------------------------------------------
      | Update existing settings
      |--------------------------------------------------------------------------
      */

      await updateStoreSettings({
        id: settings.id,
        shipping_charge,
        free_shipping_threshold,
        default_delivery_days,
        cod_enabled,
        online_payment_enabled,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get updated settings
    |--------------------------------------------------------------------------
    */

    const updatedSettings =
      await getStoreSettings();

    return res.status(200).json({
      success: true,
      message:
        "Settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error(
      "Update settings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update settings",
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
};
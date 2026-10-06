const offerModel = require("../models/offerModel");

// CREATE OFFER
const createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
    } = req.body;

    // TITLE
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Offer title is required",
      });
    }

    // DISCOUNT TYPE
    if (!["PERCENTAGE", "FIXED"].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message:
          "Discount type must be PERCENTAGE or FIXED",
      });
    }

    // DISCOUNT VALUE
    if (
      discount_value === undefined ||
      discount_value === null ||
      discount_value === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount value is required",
      });
    }

    const discountValue = Number(discount_value);

    if (Number.isNaN(discountValue)) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be a valid number",
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    // PERCENTAGE VALIDATION
    if (
      discount_type === "PERCENTAGE" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // DATES
    if (!start_date) {
      return res.status(400).json({
        success: false,
        message: "Start date is required",
      });
    }

    if (!end_date) {
      return res.status(400).json({
        success: false,
        message: "End date is required",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date or end date",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // IMAGE
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    const offerId = await offerModel.createOffer({
      title: title.trim(),
      description,
      image: imagePath,
      discount_type,
      discount_value: discountValue,
      start_date,
      end_date,
    });

    const offer = await offerModel.getOfferById(
      offerId
    );

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    console.error("Create offer error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL OFFERS
const getAllOffers = async (req, res) => {
  try {
    const offers = await offerModel.getAllOffers();

    return res.status(200).json({
      success: true,
      message: "Offers fetched successfully",
      offers,
    });
  } catch (error) {
    console.error("Get all offers error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET OFFER BY ID
const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await offerModel.getOfferById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer fetched successfully",
      offer,
    });
  } catch (error) {
    console.error("Get offer by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE OFFER
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
    } = req.body;

    // CHECK OFFER
    const existingOffer =
      await offerModel.getOfferById(id);

    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // TITLE
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Offer title is required",
      });
    }

    // DISCOUNT TYPE
    if (!["PERCENTAGE", "FIXED"].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message:
          "Discount type must be PERCENTAGE or FIXED",
      });
    }

    // DISCOUNT VALUE
    if (
      discount_value === undefined ||
      discount_value === null ||
      discount_value === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount value is required",
      });
    }

    const discountValue = Number(discount_value);

    if (Number.isNaN(discountValue)) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be a valid number",
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    if (
      discount_type === "PERCENTAGE" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // DATES
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date or end date",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    await offerModel.updateOffer(id, {
      title: title.trim(),
      description,
      image: imagePath,
      discount_type,
      discount_value: discountValue,
      start_date,
      end_date,
    });

    const updatedOffer =
      await offerModel.getOfferById(id);

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Update offer error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE OFFER STATUS
const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    const existingOffer =
      await offerModel.getOfferById(id);

    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    await offerModel.updateOfferStatus(id, status);

    const updatedOffer =
      await offerModel.getOfferById(id);

    return res.status(200).json({
      success: true,
      message: `Offer ${status.toLowerCase()} successfully`,
      offer: updatedOffer,
    });
  } catch (error) {
    console.error(
      "Update offer status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE OFFER
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOffer =
      await offerModel.getOfferById(id);

    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    await offerModel.deleteOffer(id);

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error("Delete offer error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
};
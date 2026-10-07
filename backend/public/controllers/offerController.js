const {
  getActiveOffers,
  getActiveOfferById,
} = require("../models/offerModel");

// ======================================================
// GET ALL CURRENT ACTIVE OFFERS
// ======================================================

const getOffers = async (req, res) => {
  try {
    const offers = await getActiveOffers();

    return res.status(200).json({
      success: true,
      message: "Active offers fetched successfully",
      data: offers,
    });
  } catch (error) {
    console.error(
      "Get public offers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
    });
  }
};

// ======================================================
// GET ONE CURRENT ACTIVE OFFER
// ======================================================

const getOfferById = async (req, res) => {
  try {
    const offerId = Number(req.params.id);

    // ==================================================
    // VALIDATE ID
    // ==================================================

    if (
      !Number.isInteger(offerId) ||
      offerId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer ID",
      });
    }

    // ==================================================
    // GET OFFER
    // ==================================================

    const offer =
      await getActiveOfferById(offerId);

    // ==================================================
    // NOT FOUND / EXPIRED / INACTIVE
    // ==================================================

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Offer fetched successfully",
      data: offer,
    });
  } catch (error) {
    console.error(
      "Get public offer by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch offer",
    });
  }
};

module.exports = {
  getOffers,
  getOfferById,
};
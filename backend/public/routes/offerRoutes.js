const express = require("express");

const {
  getOffers,
  getOfferById,
} = require("../controllers/offerController");

const router = express.Router();

// ======================================================
// GET ALL CURRENT ACTIVE OFFERS
// GET /api/public/offers
// ======================================================

router.get("/", getOffers);

// ======================================================
// GET ONE CURRENT ACTIVE OFFER
// GET /api/public/offers/:id
// ======================================================

router.get("/:id", getOfferById);

module.exports = router;
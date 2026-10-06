const express = require("express");

const {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
} = require("../controllers/offerController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");
const productUpload = require("../../middleware/productUploadMiddleware");

const router = express.Router();

// CREATE OFFER
router.post(
  "/",
  adminAuthMiddleware,
  productUpload.single("image"),
  createOffer
);

// GET ALL OFFERS
router.get(
  "/",
  adminAuthMiddleware,
  getAllOffers
);

// GET OFFER BY ID
router.get(
  "/:id",
  adminAuthMiddleware,
  getOfferById
);

// UPDATE OFFER
router.put(
  "/:id",
  adminAuthMiddleware,
  productUpload.single("image"),
  updateOffer
);

// UPDATE OFFER STATUS
router.patch(
  "/:id/status",
  adminAuthMiddleware,
  updateOfferStatus
);

// DELETE OFFER
router.delete(
  "/:id",
  adminAuthMiddleware,
  deleteOffer
);

module.exports = router;
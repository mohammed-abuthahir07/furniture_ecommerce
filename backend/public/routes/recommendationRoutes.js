const express = require("express");

const {
  getRecommendations,
} = require("../controllers/recommendationController");

const router = express.Router();


// GET RECOMMENDED PRODUCTS
router.get("/", getRecommendations);


module.exports = router;
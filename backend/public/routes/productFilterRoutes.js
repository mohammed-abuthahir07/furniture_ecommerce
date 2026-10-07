const express = require("express");

const {
  searchAndFilterProducts,
} = require("../controllers/productFilterController");

const router = express.Router();

// ======================================================
// SEARCH + FILTER + PAGINATION
// ======================================================

router.get("/", searchAndFilterProducts);

module.exports = router;
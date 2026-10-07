const express = require("express");

const {
  compareProducts,
} = require("../controllers/comparisonController");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| COMPARE PRODUCTS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  compareProducts
);


module.exports = router;
const express = require("express");

const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile
} = require("../controllers/customerAuthController");

const customerAuthMiddleware =
  require("../../middleware/customerAuthMiddleware");


const router = express.Router();


/*
|--------------------------------------------------------------------------
| CUSTOMER REGISTER
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  registerCustomer
);


/*
|--------------------------------------------------------------------------
| CUSTOMER LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  loginCustomer
);


/*
|--------------------------------------------------------------------------
| CUSTOMER PROFILE
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",
  customerAuthMiddleware,
  getCustomerProfile
);


module.exports = router;
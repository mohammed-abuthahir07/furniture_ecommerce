const express = require("express");

const customerAuthMiddleware = require("../../middleware/customerAuthMiddleware");

const {
  placeOrder,
  getMyOrders,
  getMyOrderById,
} = require("../controllers/orderController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PLACE ORDER
|--------------------------------------------------------------------------
| POST /api/customer/orders
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  customerAuthMiddleware,
  placeOrder
);

/*
|--------------------------------------------------------------------------
| GET CUSTOMER ORDERS
|--------------------------------------------------------------------------
| GET /api/customer/orders
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  customerAuthMiddleware,
  getMyOrders
);

/*
|--------------------------------------------------------------------------
| GET CUSTOMER ORDER BY ID
|--------------------------------------------------------------------------
| GET /api/customer/orders/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  customerAuthMiddleware,
  getMyOrderById
);

module.exports = router;
const express = require("express");

const {
  createRequest,
  getMyRequests,
  getMyRequestById,
  updateMyRequest
} = require("../controllers/customizationRequestController");

const customerAuthMiddleware =
  require("../../middleware/customerAuthMiddleware");

const customizationUpload =
  require("../../middleware/customizationUploadMiddleware");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| CREATE CUSTOMIZATION REQUEST
|--------------------------------------------------------------------------
|
| POST
| /api/customer/customization-requests
|
| Customer sends:
|
| request_type
| product_id
| customer_requirement
| customer_image
|
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  customerAuthMiddleware,
  customizationUpload.single("customer_image"),
  createRequest
);


/*
|--------------------------------------------------------------------------
| GET MY CUSTOMIZATION REQUESTS
|--------------------------------------------------------------------------
|
| GET
| /api/customer/customization-requests
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  customerAuthMiddleware,
  getMyRequests
);


/*
|--------------------------------------------------------------------------
| GET MY CUSTOMIZATION REQUEST BY ID
|--------------------------------------------------------------------------
|
| GET
| /api/customer/customization-requests/:id
|
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  customerAuthMiddleware,
  getMyRequestById
);


/*
|--------------------------------------------------------------------------
| UPDATE MY CUSTOMIZATION REQUEST
|--------------------------------------------------------------------------
|
| PUT
| /api/customer/customization-requests/:id
|
| Customer can update:
|
| - customer_requirement
| - customer_image
|
| Customer cannot update:
|
| - status
| - admin_reply
| - additional_cost
| - request_type
| - product_id
|
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  customerAuthMiddleware,
  customizationUpload.single("customer_image"),
  updateMyRequest
);


module.exports = router;
const express = require("express");

const {
  getAllRequests,
  getRequestById,
  getRequestsByStatus,
  changeStatus,
  replyToRequest,
  deleteRequest
} = require("../controllers/customizationRequestController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMIZATION REQUESTS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  adminAuthMiddleware,
  getAllRequests
);


/*
|--------------------------------------------------------------------------
| GET CUSTOMIZATION REQUESTS BY STATUS
|--------------------------------------------------------------------------
*/

router.get(
  "/status/:status",
  adminAuthMiddleware,
  getRequestsByStatus
);


/*
|--------------------------------------------------------------------------
| GET SINGLE CUSTOMIZATION REQUEST
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  adminAuthMiddleware,
  getRequestById
);


/*
|--------------------------------------------------------------------------
| ADMIN CHANGE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  adminAuthMiddleware,
  changeStatus
);


/*
|--------------------------------------------------------------------------
| ADMIN REPLY
|--------------------------------------------------------------------------
*/

router.put(
  "/:id/reply",
  adminAuthMiddleware,
  replyToRequest
);


/*
|--------------------------------------------------------------------------
| DELETE REQUEST
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  adminAuthMiddleware,
  deleteRequest
);


module.exports = router;
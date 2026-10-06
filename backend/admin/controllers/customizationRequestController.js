const {
  getAllCustomizationRequests,
  getCustomizationRequestById,
  getCustomizationRequestsByStatus,
  updateCustomizationRequestStatus,
  updateCustomizationRequestReply,
  deleteCustomizationRequest
} = require("../models/customizationRequestModel");


/*
|--------------------------------------------------------------------------
| GET ALL REQUESTS
|--------------------------------------------------------------------------
*/

const getAllRequests = async (req, res) => {
  try {
    const requests = await getAllCustomizationRequests();

    return res.status(200).json({
      success: true,
      message: "Customization requests fetched successfully",
      requests
    });

  } catch (error) {
    console.error(
      "Get customization requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customization requests"
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET REQUEST BY ID
|--------------------------------------------------------------------------
*/

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid request ID is required"
      });
    }

    const request = await getCustomizationRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customization request fetched successfully",
      request
    });

  } catch (error) {
    console.error(
      "Get customization request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customization request"
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET REQUESTS BY STATUS
|--------------------------------------------------------------------------
*/

const getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const allowedStatuses = [
      "PENDING",
      "UNDER_REVIEW",
      "ADMIN_REPLIED",
      "CUSTOMER_ACCEPTED",
      "READY_TO_ORDER",
      "ORDERED",
      "REJECTED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization request status"
      });
    }

    const requests =
      await getCustomizationRequestsByStatus(status);

    return res.status(200).json({
      success: true,
      message: "Customization requests fetched successfully",
      status,
      requests
    });

  } catch (error) {
    console.error(
      "Get customization requests by status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customization requests"
    });
  }
};


/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
|
| Admin is allowed to:
|
| PENDING -> UNDER_REVIEW
|
| UNDER_REVIEW -> REJECTED
|
| Customer-controlled statuses are NOT allowed here:
|
| CUSTOMER_ACCEPTED
| READY_TO_ORDER
| ORDERED
|
|--------------------------------------------------------------------------
*/

const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid request ID is required"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const request = await getCustomizationRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | PENDING -> UNDER_REVIEW
    |--------------------------------------------------------------------------
    */

    if (
      request.status === "PENDING" &&
      status === "UNDER_REVIEW"
    ) {
      const affectedRows =
        await updateCustomizationRequestStatus(
          id,
          status
        );

      if (!affectedRows) {
        return res.status(400).json({
          success: false,
          message: "Unable to update request status"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Request moved to UNDER_REVIEW",
        status: "UNDER_REVIEW"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | UNDER_REVIEW -> REJECTED
    |--------------------------------------------------------------------------
    */

    if (
      request.status === "UNDER_REVIEW" &&
      status === "REJECTED"
    ) {
      const affectedRows =
        await updateCustomizationRequestStatus(
          id,
          status
        );

      if (!affectedRows) {
        return res.status(400).json({
          success: false,
          message: "Unable to reject request"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customization request rejected",
        status: "REJECTED"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | INVALID ADMIN STATUS TRANSITION
    |--------------------------------------------------------------------------
    */

    return res.status(400).json({
      success: false,
      message: `Cannot change status from ${request.status} to ${status}`
    });

  } catch (error) {
    console.error(
      "Change customization request status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update customization request status"
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN REPLY
|--------------------------------------------------------------------------
*/

const replyToRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      admin_reply,
      additional_cost
    } = req.body;


    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid request ID is required"
      });
    }


    if (
      !admin_reply ||
      !admin_reply.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin reply is required"
      });
    }


    const request =
      await getCustomizationRequestById(id);


    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Reply is allowed only when request is UNDER_REVIEW
    |--------------------------------------------------------------------------
    */

    if (request.status !== "UNDER_REVIEW") {
      return res.status(400).json({
        success: false,
        message:
          "Admin can reply only to requests in UNDER_REVIEW status"
      });
    }


    const parsedAdditionalCost =
      additional_cost === undefined ||
      additional_cost === null ||
      additional_cost === ""
        ? 0
        : Number(additional_cost);


    if (
      !Number.isFinite(parsedAdditionalCost) ||
      parsedAdditionalCost < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Additional cost must be a valid number greater than or equal to 0"
      });
    }


    const affectedRows =
      await updateCustomizationRequestReply(
        id,
        admin_reply.trim(),
        parsedAdditionalCost
      );


    if (!affectedRows) {
      return res.status(400).json({
        success: false,
        message: "Unable to send admin reply"
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Admin reply sent successfully",
      status: "ADMIN_REPLIED",
      additional_cost: parsedAdditionalCost
    });

  } catch (error) {
    console.error(
      "Reply to customization request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send admin reply"
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE REQUEST
|--------------------------------------------------------------------------
*/

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid request ID is required"
      });
    }

    const request =
      await getCustomizationRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Do not delete completed/ordered requests
    |--------------------------------------------------------------------------
    */

    if (request.status === "ORDERED") {
      return res.status(400).json({
        success: false,
        message:
          "Ordered customization requests cannot be deleted"
      });
    }


    const affectedRows =
      await deleteCustomizationRequest(id);


    if (!affectedRows) {
      return res.status(400).json({
        success: false,
        message: "Unable to delete customization request"
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Customization request deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete customization request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete customization request"
    });
  }
};


module.exports = {
  getAllRequests,
  getRequestById,
  getRequestsByStatus,
  changeStatus,
  replyToRequest,
  deleteRequest
};
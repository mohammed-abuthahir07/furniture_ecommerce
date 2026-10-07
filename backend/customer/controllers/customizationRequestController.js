const {
  findProductById,
  createCustomizationRequest,
  getCustomerCustomizationRequests,
  getCustomerCustomizationRequestById,
  updateCustomerCustomizationRequest
} = require("../models/customizationRequestModel");


/*
|--------------------------------------------------------------------------
| CREATE CUSTOMIZATION REQUEST
|--------------------------------------------------------------------------
|
| Customer can create:
|
| EXISTING_PRODUCT
| NEW_PRODUCT
|
|--------------------------------------------------------------------------
*/

const createRequest = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Customer ID comes ONLY from JWT
    |--------------------------------------------------------------------------
    */

    const customerId = req.customer.id;

    let {
      request_type,
      product_id,
      customer_requirement
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | Normalize Request Type
    |--------------------------------------------------------------------------
    */

    request_type = request_type
      ? String(request_type).trim().toUpperCase()
      : "";


    /*
    |--------------------------------------------------------------------------
    | Validate Request Type
    |--------------------------------------------------------------------------
    */

    const allowedRequestTypes = [
      "EXISTING_PRODUCT",
      "NEW_PRODUCT"
    ];

    if (!request_type) {
      return res.status(400).json({
        success: false,
        message: "Request type is required"
      });
    }

    if (!allowedRequestTypes.includes(request_type)) {
      return res.status(400).json({
        success: false,
        message:
          "Request type must be EXISTING_PRODUCT or NEW_PRODUCT"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Customer Requirement
    |--------------------------------------------------------------------------
    */

    customer_requirement = customer_requirement
      ? String(customer_requirement).trim()
      : "";

    if (!customer_requirement) {
      return res.status(400).json({
        success: false,
        message: "Customer requirement is required"
      });
    }

    if (customer_requirement.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Customer requirement must contain at least 5 characters"
      });
    }

    if (customer_requirement.length > 5000) {
      return res.status(400).json({
        success: false,
        message:
          "Customer requirement cannot exceed 5000 characters"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Product ID
    |--------------------------------------------------------------------------
    */

    let productId = null;


    /*
    |--------------------------------------------------------------------------
    | EXISTING PRODUCT
    |--------------------------------------------------------------------------
    */

    if (request_type === "EXISTING_PRODUCT") {

      if (
        product_id === undefined ||
        product_id === null ||
        product_id === ""
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product ID is required for EXISTING_PRODUCT request"
        });
      }

      productId = Number(product_id);

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID"
        });
      }


      /*
      |--------------------------------------------------------------------------
      | Check Product
      |--------------------------------------------------------------------------
      */

      const product =
        await findProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }


      /*
      |--------------------------------------------------------------------------
      | Product Must Be Active
      |--------------------------------------------------------------------------
      */

      if (product.status !== "ACTIVE") {
        return res.status(400).json({
          success: false,
          message:
            "Customization request cannot be created for an inactive product"
        });
      }
    }


    /*
    |--------------------------------------------------------------------------
    | NEW PRODUCT
    |--------------------------------------------------------------------------
    */

    if (request_type === "NEW_PRODUCT") {
      productId = null;
    }


    /*
    |--------------------------------------------------------------------------
    | Customer Image
    |--------------------------------------------------------------------------
    */

    const customerImage = req.file
      ? `/uploads/customizations/${req.file.filename}`
      : null;


    /*
    |--------------------------------------------------------------------------
    | Create Request
    |--------------------------------------------------------------------------
    */

    const requestId =
      await createCustomizationRequest({
        customerId,
        requestType: request_type,
        productId,
        customerRequirement: customer_requirement,
        customerImage
      });


    /*
    |--------------------------------------------------------------------------
    | Get Created Request
    |--------------------------------------------------------------------------
    */

    const createdRequest =
      await getCustomerCustomizationRequestById(
        customerId,
        requestId
      );


    return res.status(201).json({
      success: true,
      message:
        "Customization request submitted successfully",
      request: createdRequest
    });

  } catch (error) {
    console.error(
      "Create customization request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create customization request"
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET MY CUSTOMIZATION REQUESTS
|--------------------------------------------------------------------------
*/

const getMyRequests = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const requests =
      await getCustomerCustomizationRequests(
        customerId
      );


    return res.status(200).json({
      success: true,
      message:
        "Customization requests fetched successfully",
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error(
      "Get customization requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customization requests"
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET MY CUSTOMIZATION REQUEST BY ID
|--------------------------------------------------------------------------
*/

const getMyRequestById = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const requestId = Number(req.params.id);


    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(requestId) ||
      requestId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Get Request
    |--------------------------------------------------------------------------
    */

    const request =
      await getCustomerCustomizationRequestById(
        customerId,
        requestId
      );


    /*
    |--------------------------------------------------------------------------
    | Ownership Check
    |--------------------------------------------------------------------------
    */

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Customization request not found"
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Customization request fetched successfully",
      request
    });

  } catch (error) {
    console.error(
      "Get customization request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customization request"
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE MY CUSTOMIZATION REQUEST
|--------------------------------------------------------------------------
|
| Customer can update ONLY:
|
| - customer_requirement
| - customer_image
|
| Customer cannot update:
|
| - request_type
| - product_id
| - status
| - admin_reply
| - additional_cost
|
|--------------------------------------------------------------------------
*/

const updateMyRequest = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const requestId = Number(req.params.id);


    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(requestId) ||
      requestId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Get Existing Request
    |--------------------------------------------------------------------------
    */

    const existingRequest =
      await getCustomerCustomizationRequestById(
        customerId,
        requestId
      );


    /*
    |--------------------------------------------------------------------------
    | Ownership Check
    |--------------------------------------------------------------------------
    */

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message:
          "Customization request not found"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Customer Can Update Only PENDING Request
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | We don't expose status to customer,
    | but we still check it internally.
    |--------------------------------------------------------------------------
    */

    const [rows] = await require("../../config/database")
      .pool.execute(
        `
        SELECT status
        FROM product_customization_requests
        WHERE id = ?
          AND customer_id = ?
        `,
        [requestId, customerId]
      );

    const currentStatus = rows[0]?.status;


    if (currentStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending customization requests can be updated"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Requirement
    |--------------------------------------------------------------------------
    */

    let customerRequirement =
      req.body.customer_requirement;


    customerRequirement = customerRequirement
      ? String(customerRequirement).trim()
      : "";


    if (!customerRequirement) {
      return res.status(400).json({
        success: false,
        message:
          "Customer requirement is required"
      });
    }


    if (customerRequirement.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Customer requirement must contain at least 5 characters"
      });
    }


    if (customerRequirement.length > 5000) {
      return res.status(400).json({
        success: false,
        message:
          "Customer requirement cannot exceed 5000 characters"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Image
    |--------------------------------------------------------------------------
    |
    | If new image uploaded:
    | use new image.
    |
    | If no new image:
    | keep existing image.
    |
    |--------------------------------------------------------------------------
    */

    const customerImage = req.file
      ? `/uploads/customizations/${req.file.filename}`
      : existingRequest.customer_image;


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const updated =
      await updateCustomerCustomizationRequest({
        customerId,
        requestId,
        customerRequirement,
        customerImage
      });


    if (!updated) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to update customization request"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Get Updated Request
    |--------------------------------------------------------------------------
    */

    const updatedRequest =
      await getCustomerCustomizationRequestById(
        customerId,
        requestId
      );


    return res.status(200).json({
      success: true,
      message:
        "Customization request updated successfully",
      request: updatedRequest
    });

  } catch (error) {
    console.error(
      "Update customization request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update customization request"
    });
  }
};


module.exports = {
  createRequest,
  getMyRequests,
  getMyRequestById,
  updateMyRequest
};
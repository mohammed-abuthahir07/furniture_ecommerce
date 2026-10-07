const jwt = require("jsonwebtoken");


const customerAuthMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;


    /*
    |--------------------------------------------------------------------------
    | CHECK AUTHORIZATION HEADER
    |--------------------------------------------------------------------------
    */

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token is required"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | GET TOKEN
    |--------------------------------------------------------------------------
    */

    const token =
      authHeader.split(" ")[1];


    /*
    |--------------------------------------------------------------------------
    | VERIFY TOKEN
    |--------------------------------------------------------------------------
    */

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    /*
    |--------------------------------------------------------------------------
    | CHECK CUSTOMER ROLE
    |--------------------------------------------------------------------------
    */

    if (decoded.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message:
          "Customer access required"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | ATTACH CUSTOMER TO REQUEST
    |--------------------------------------------------------------------------
    */

    req.customer = {
      id: decoded.id,
      role: decoded.role
    };


    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token"
    });
  }
};


module.exports =
  customerAuthMiddleware;
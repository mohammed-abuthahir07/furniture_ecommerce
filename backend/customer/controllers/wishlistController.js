const {
  addToWishlist,
  findWishlistItem,
  getCustomerWishlist,
  getWishlistItemByProduct,
  deleteWishlistItem
} = require("../models/wishlistModel");

const { pool } = require("../../config/database");

const addProductToWishlist = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const productId = Number(product_id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Check product exists and is active
    const [products] = await pool.execute(
      `
      SELECT
        id,
        name,
        status
      FROM products
      WHERE id = ?
      `,
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (products[0].status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Inactive products cannot be added to wishlist"
      });
    }

    // Check if already wishlisted
    const existingItem = await findWishlistItem(
      customerId,
      productId
    );

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "Product is already in your wishlist"
      });
    }

    const wishlistId = await addToWishlist(
      customerId,
      productId
    );

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist_id: wishlistId,
      product_id: productId
    });
  } catch (error) {
    console.error(
      "Add product to wishlist error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist"
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const wishlist = await getCustomerWishlist(
      customerId
    );

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist
    });
  } catch (error) {
    console.error(
      "Get wishlist error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist"
    });
  }
};

const checkWishlist = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const productId = Number(req.params.productId);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const item = await getWishlistItemByProduct(
      customerId,
      productId
    );

    return res.status(200).json({
      success: true,
      product_id: productId,
      is_wishlisted: !!item,
      wishlist_item: item || null
    });
  } catch (error) {
    console.error(
      "Check wishlist error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to check wishlist"
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const productId = Number(req.params.productId);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const existingItem = await findWishlistItem(
      customerId,
      productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your wishlist"
      });
    }

    await deleteWishlistItem(
      customerId,
      productId
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      product_id: productId
    });
  } catch (error) {
    console.error(
      "Remove from wishlist error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist"
    });
  }
};

module.exports = {
  addProductToWishlist,
  getWishlist,
  checkWishlist,
  removeFromWishlist
};
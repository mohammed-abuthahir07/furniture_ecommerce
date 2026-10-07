const {
  findProductById,
  findVariantById,
  findCartItem,
  findCartItemById,
  createCartItem,
  updateCartItemQuantity,
  getCustomerCart,
  deleteCartItem,
  clearCustomerCart
} = require("../models/cartModel");


// ==========================================
// ADD TO CART
// POST /api/customer/cart
// ==========================================

const addToCart = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const {
      product_id,
      variant_id,
      quantity
    } = req.body;

    const productId = Number(product_id);
    const variantId = Number(variant_id);
    const requestedQuantity = Number(quantity);


    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required"
      });
    }


    if (
      !Number.isInteger(variantId) ||
      variantId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid variant ID is required"
      });
    }


    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number"
      });
    }


    // Check product
    const product =
      await findProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }


    if (product.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable"
      });
    }


    // Check variant
    const variant =
      await findVariantById(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found"
      });
    }


    // Make sure variant belongs to product
    if (Number(variant.product_id) !== productId) {
      return res.status(400).json({
        success: false,
        message: "Selected variant does not belong to this product"
      });
    }


    if (variant.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "This variant is currently unavailable"
      });
    }


    if (variant.stock_quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "This variant is out of stock"
      });
    }


    // Check existing cart item
    const existingItem =
      await findCartItem(
        customerId,
        productId,
        variantId
      );


    let finalQuantity = requestedQuantity;


    if (existingItem) {
      finalQuantity =
        Number(existingItem.quantity) +
        requestedQuantity;
    }


    // Check stock
    if (
      finalQuantity >
      Number(variant.stock_quantity)
    ) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock_quantity} items are available in stock`
      });
    }


    // Update existing item
    if (existingItem) {

      await updateCartItemQuantity(
        customerId,
        existingItem.id,
        finalQuantity
      );

      return res.status(200).json({
        success: true,
        message: "Cart quantity updated successfully",
        cart_item_id: existingItem.id,
        quantity: finalQuantity
      });
    }


    // Create new cart item
    const cartItemId =
      await createCartItem({
        customerId,
        productId,
        variantId,
        quantity: requestedQuantity
      });


    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      cart_item_id: cartItemId,
      quantity: requestedQuantity
    });

  } catch (error) {

    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart"
    });
  }
};


// ==========================================
// GET MY CART
// GET /api/customer/cart
// ==========================================

const getCart = async (req, res) => {
  try {

    const customerId = req.customer.id;

    const cart =
      await getCustomerCart(customerId);


    let subtotal = 0;
    let totalItems = 0;


    for (const item of cart) {
      subtotal += Number(item.item_subtotal);
      totalItems += Number(item.quantity);
    }


    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",

      cart: {
        items: cart,
        total_items: totalItems,
        subtotal: Number(subtotal.toFixed(2))
      }
    });

  } catch (error) {

    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart"
    });
  }
};


// ==========================================
// UPDATE CART QUANTITY
// PATCH /api/customer/cart/:id
// ==========================================

const updateCartQuantity = async (req, res) => {
  try {

    const customerId = req.customer.id;

    const cartItemId =
      Number(req.params.id);

    const requestedQuantity =
      Number(req.body.quantity);


    if (
      !Number.isInteger(cartItemId) ||
      cartItemId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID"
      });
    }


    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number"
      });
    }


    // Find cart item using customer ID
    const cartItem =
      await findCartItemById(
        customerId,
        cartItemId
      );


    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }


    // Get latest variant stock
    const variant =
      await findVariantById(
        cartItem.variant_id
      );


    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found"
      });
    }


    if (variant.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "This variant is currently unavailable"
      });
    }


    if (variant.stock_quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "This variant is out of stock"
      });
    }


    if (
      requestedQuantity >
      Number(variant.stock_quantity)
    ) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock_quantity} items are available in stock`
      });
    }


    await updateCartItemQuantity(
      customerId,
      cartItemId,
      requestedQuantity
    );


    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart_item_id: cartItemId,
      quantity: requestedQuantity
    });

  } catch (error) {

    console.error(
      "Update cart quantity error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update cart quantity"
    });
  }
};


// ==========================================
// REMOVE CART ITEM
// DELETE /api/customer/cart/:id
// ==========================================

const removeFromCart = async (req, res) => {
  try {

    const customerId = req.customer.id;

    const cartItemId =
      Number(req.params.id);


    if (
      !Number.isInteger(cartItemId) ||
      cartItemId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID"
      });
    }


    const cartItem =
      await findCartItemById(
        customerId,
        cartItemId
      );


    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }


    await deleteCartItem(
      customerId,
      cartItemId
    );


    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully"
    });

  } catch (error) {

    console.error(
      "Remove cart item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item"
    });
  }
};


// ==========================================
// CLEAR CART
// DELETE /api/customer/cart
// ==========================================

const clearCart = async (req, res) => {
  try {

    const customerId = req.customer.id;

    await clearCustomerCart(customerId);


    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {

    console.error(
      "Clear cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
};


module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};
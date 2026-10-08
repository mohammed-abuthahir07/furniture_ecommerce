# Furniture Ecommerce API Documentation

Base URL: `http://localhost:5000`

All responses are JSON. Successful responses use `success: true`. Failed responses use `success: false` and a `message` string.

```json
{
  "success": false,
  "message": "Error description"
}
```

A server failure returns HTTP `500` with message `Internal server error` or a specific failure message such as `Failed to fetch orders`.

## Authentication

Send the token on protected routes:

```
Authorization: Bearer <token>
```

| Side | Login | Token lifetime | Required role |
| --- | --- | --- | --- |
| Admin | `POST /api/admin/auth/login` | 1 day | `ADMIN` |
| Customer | `POST /api/customer/auth/login` or `POST /api/customer/auth/google` | 7 days | `CUSTOMER` |

Missing token:

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

Wrong role returns HTTP `403` (`Admin access required` or `Customer access required`). An invalid or expired token returns HTTP `401` (`Invalid or expired authentication token`).

Public routes do not require a token.

## Content types

- JSON body: `Content-Type: application/json`
- File upload: `multipart/form-data`

Uploaded files are stored as path strings in the response:

| Upload | Field name | Stored path |
| --- | --- | --- |
| Product main image and gallery | `main_image` or `image` | `/uploads/products/<filename>` |
| Offer image | `image` | `/uploads/products/<filename>` |
| Customer profile image | `profile_image` | `/uploads/customers/<filename>` |
| Customization image | `customer_image` | path saved by the customization upload middleware |
| Custom requirement image | `reference_image` | `/uploads/custom-requirements/<filename>` |

## Shared values

| Field | Allowed values |
| --- | --- |
| Account, category, product, variant, offer status | `ACTIVE`, `INACTIVE` |
| Order status | `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED` |
| Payment method | `COD`, `ONLINE` |
| Payment status on a new order | `PENDING` |
| Assembly | `YES`, `NO` |
| Offer discount type | `PERCENTAGE`, `FIXED` |
| Customization request type | `EXISTING_PRODUCT`, `NEW_PRODUCT` |
| Customization request status | `PENDING`, `UNDER_REVIEW`, `ADMIN_REPLIED`, `CUSTOMER_ACCEPTED`, `READY_TO_ORDER`, `ORDERED`, `REJECTED` |
| Stock availability | `AVAILABLE`, `LOW STOCK` (1 to 5 units), `SOLD OUT`, `INACTIVE` |

Dates used by reports and analytics must be `YYYY-MM-DD`.

---

# Public APIs

No token is required.

## Categories

### Get all active categories

`GET /api/public/categories`

Request: none.

Response `200`:

```json
{
  "success": true,
  "message": "Active categories fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Sofas",
      "description": "Living room sofas",
      "image": "category-image-url-or-path"
    }
  ]
}
```

Only categories with status `ACTIVE` are returned.

### Get one active category

`GET /api/public/categories/:id`

Request: path `id`.

Response `200`: same category object inside `data`.

Response `404`: `Category not found` when the id is missing or the category is inactive.

## Products

### Get all active products

`GET /api/public/products`

Request: none.

Response `200`:

```json
{
  "success": true,
  "message": "Active products fetched successfully",
  "data": [
    {
      "id": 1,
      "category_id": 2,
      "category_name": "Sofas",
      "name": "Oak Sofa",
      "brand": "Woodline",
      "main_image": "/uploads/products/sofa.jpg",
      "short_description": "Three seat sofa",
      "mrp": "45000.00",
      "selling_price": "39999.00",
      "material": "Wood",
      "wood_type": "Oak",
      "length": "210.00",
      "width": "90.00",
      "height": "85.00",
      "weight": "42.00",
      "seating_capacity": 3,
      "assembly_required": "NO",
      "delivery_days": 6,
      "average_rating": "4.5",
      "total_reviews": 12
    }
  ]
}
```

Only products whose product status and category status are both `ACTIVE` are returned. Ratings count approved reviews only.

### Get one active product

`GET /api/public/products/:id`

Request: path `id`.

Response `200`:

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "category_id": 2,
    "category_name": "Sofas",
    "name": "Oak Sofa",
    "brand": "Woodline",
    "main_image": "/uploads/products/sofa.jpg",
    "short_description": "Three seat sofa",
    "description": "Full description",
    "mrp": "45000.00",
    "selling_price": "39999.00",
    "material": "Wood",
    "wood_type": "Oak",
    "length": "210.00",
    "width": "90.00",
    "height": "85.00",
    "weight": "42.00",
    "seating_capacity": 3,
    "assembly_required": "NO",
    "delivery_days": 6,
    "images": [
      {
        "id": 10,
        "image": "/uploads/products/gallery.jpg",
        "image_title": "Side view",
        "sort_order": 1
      }
    ],
    "variants": [
      {
        "id": 4,
        "variant_name": "Walnut",
        "color": "Brown",
        "stock_quantity": 8,
        "availability_status": "AVAILABLE"
      }
    ],
    "rating": {
      "average_rating": 4.5,
      "total_reviews": 12
    },
    "reviews": [
      {
        "id": 3,
        "rating": 5,
        "comment": "Very comfortable",
        "created_at": "2026-10-01T10:00:00.000Z",
        "customer_name": "Asha"
      }
    ]
  }
}
```

Inactive variants are omitted. `availability_status` is `SOLD OUT` when stock is `0`, otherwise `AVAILABLE`.

Response `404`: `Product not found`.

### Get approved reviews for a product

`GET /api/public/products/:productId/reviews`

Request: path `productId`.

Response `200`:

```json
{
  "success": true,
  "product_id": 1,
  "product_name": "Oak Sofa",
  "average_rating": 4.5,
  "total_reviews": 12,
  "rating_summary": {
    "5": 6,
    "4": 4,
    "3": 1,
    "2": 1,
    "1": 0
  },
  "reviews": [
    {
      "id": 3,
      "rating": 5,
      "comment": "Very comfortable",
      "created_at": "2026-10-01T10:00:00.000Z",
      "updated_at": "2026-10-01T10:00:00.000Z",
      "customer_id": 8,
      "customer_name": "Asha",
      "profile_image": "/uploads/customers/asha.jpg"
    }
  ]
}
```

Only reviews with status `APPROVED` are included.

## Product search and filters

### Search, filter, and paginate products

`GET /api/public/product-filters`

Query parameters (all optional except the defaults below):

| Query | Type | Rules |
| --- | --- | --- |
| `search` | string | Matches name, brand, short description, or description |
| `category_id` | number | Positive integer |
| `material` | string | Exact material |
| `wood_type` | string | Exact wood type |
| `min_price` | number | `0` or greater. Compared with `selling_price` |
| `max_price` | number | `0` or greater. Must be greater than or equal to `min_price` |
| `sort` | string | `price_low`, `price_high`, `name_asc`, `name_desc`, `newest`, `oldest`. Default is newest (`id` descending) |
| `page` | number | Positive integer. Default `1` |
| `limit` | number | Integer from `1` to `100`. Default `10` |

Example:

`GET /api/public/product-filters?search=sofa&category_id=2&min_price=10000&max_price=50000&sort=price_low&page=1&limit=10`

Response `200`:

```json
{
  "success": true,
  "message": "Products filtered successfully",
  "data": [
    {
      "id": 1,
      "category_id": 2,
      "category_name": "Sofas",
      "name": "Oak Sofa",
      "brand": "Woodline",
      "main_image": "/uploads/products/sofa.jpg",
      "short_description": "Three seat sofa",
      "mrp": "45000.00",
      "selling_price": "39999.00",
      "material": "Wood",
      "wood_type": "Oak",
      "length": "210.00",
      "width": "90.00",
      "height": "85.00",
      "weight": "42.00",
      "seating_capacity": 3,
      "assembly_required": "NO",
      "delivery_days": 6,
      "average_rating": "4.5",
      "total_reviews": 12
    }
  ],
  "pagination": {
    "current_page": 1,
    "limit": 10,
    "total_products": 24,
    "total_pages": 3,
    "has_next_page": true,
    "has_previous_page": false
  }
}
```

## Offers

### Get current active offers

`GET /api/public/offers`

Request: none.

Response `200`:

```json
{
  "success": true,
  "message": "Active offers fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Festive Sale",
      "description": "Limited period offer",
      "image": "/uploads/products/offer.jpg",
      "discount_type": "PERCENTAGE",
      "discount_value": "10.00",
      "start_date": "2026-10-01",
      "end_date": "2026-10-31"
    }
  ]
}
```

An offer is returned only when status is `ACTIVE` and today's date is inside `start_date` and `end_date`.

### Get one current active offer

`GET /api/public/offers/:id`

Request: path `id`.

Response `200`: the offer object inside `data`.

Response `404`: `Offer not found`.

## Recommendations

### Get recommended products

`GET /api/public/recommendations?product_id=1&limit=8`

| Query | Required | Rules |
| --- | --- | --- |
| `product_id` | Yes | Positive integer of an active product |
| `limit` | No | Integer from `1` to `20`. Default `8` |

Response `200`:

```json
{
  "success": true,
  "message": "Recommended products fetched successfully",
  "data": [
    {
      "id": 5,
      "category_id": 2,
      "category_name": "Sofas",
      "name": "Teak Sofa",
      "brand": "Woodline",
      "main_image": "/uploads/products/teak.jpg",
      "short_description": "Similar sofa",
      "mrp": "50000.00",
      "selling_price": "44000.00",
      "material": "Wood",
      "wood_type": "Teak",
      "length": "200.00",
      "width": "88.00",
      "height": "84.00",
      "weight": "40.00",
      "seating_capacity": 3,
      "assembly_required": "YES",
      "delivery_days": 6,
      "average_rating": "4.2",
      "total_reviews": 4
    }
  ]
}
```

Recommendations prefer the same category, material, and wood type as the source product. The source product itself is excluded.

Response `400`: `Valid product_id is required` or `Limit must be between 1 and 20`.

Response `404`: `Product not found`.

## Home

### Get home page data

`GET /api/public/home`

Request: none.

Response `200`:

```json
{
  "success": true,
  "message": "Home data fetched successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Sofas",
        "description": "Living room sofas",
        "image": "category-image"
      }
    ],
    "featured_products": [],
    "new_arrivals": [],
    "best_selling_products": [],
    "top_rated_products": [],
    "offers": []
  }
}
```

- `categories`: up to 8 active categories, ordered by name.
- `featured_products` and `new_arrivals`: active products, newest first.
- `best_selling_products`: products ranked by sold quantity, cancelled orders excluded.
- `top_rated_products`: active products ranked by approved average rating.
- `offers`: current active offers.

Product cards use the same product fields as the public product list (`id`, `category_id`, `category_name`, `name`, `brand`, `main_image`, `short_description`, `mrp`, `selling_price`, `material`, `wood_type`, dimensions, `seating_capacity`, `assembly_required`, `delivery_days`, `average_rating`, `total_reviews`). Best-selling cards also include sold quantity.

## Product comparison

### Compare 2 to 4 products

`GET /api/public/products/compare?ids=2,3,5`

Query `ids` is required. Send 2 to 4 unique positive product ids, separated by commas.

Response `200`:

```json
{
  "success": true,
  "message": "Products compared successfully",
  "data": {
    "comparison_count": 2,
    "products": [
      {
        "id": 2,
        "category_id": 1,
        "category_name": "Sofas",
        "name": "Oak Sofa",
        "brand": "Woodline",
        "main_image": "/uploads/products/sofa.jpg",
        "short_description": "Three seat sofa",
        "description": "Full description",
        "mrp": "45000.00",
        "selling_price": "39999.00",
        "material": "Wood",
        "wood_type": "Oak",
        "length": "210.00",
        "width": "90.00",
        "height": "85.00",
        "weight": "42.00",
        "seating_capacity": 3,
        "assembly_required": "NO",
        "delivery_days": 6,
        "status": "ACTIVE",
        "average_rating": "4.5",
        "total_reviews": 12,
        "variants": [
          {
            "id": 4,
            "product_id": 2,
            "variant_name": "Walnut",
            "color": "Brown",
            "stock_quantity": 8,
            "status": "ACTIVE",
            "availability_status": "AVAILABLE"
          }
        ]
      }
    ]
  }
}
```

Products stay in the same order as the `ids` query. Inactive products are treated as unavailable.

Response `400`: `Product ids are required`, `You can compare between 2 and 4 products`, `Product ids must be valid positive integers`, or `Duplicate product ids are not allowed`.

Response `404`:

```json
{
  "success": false,
  "message": "One or more products are not available for comparison",
  "missing_product_ids": [9]
}
```

This route is registered after `GET /api/public/products/:id`. A request to `/api/public/products/compare` can be handled as a product id named `compare` before it reaches the comparison handler.

## Custom requirements

Anyone can submit a custom furniture requirement. This is separate from a logged-in customer's product customization request.

### Submit a custom requirement

`POST /api/public/custom-requirements`

`Content-Type: multipart/form-data`

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | Trimmed text |
| `phone` | Yes | Trimmed text |
| `address` | Yes | Trimmed text |
| `requirement` | Yes | Trimmed text |
| `email` | No | |
| `city` | No | |
| `state` | No | |
| `pincode` | No | |
| `alternative_address` | No | |
| `reference_image` | No | File |

Response `201`:

```json
{
  "success": true,
  "message": "Custom requirement submitted successfully",
  "data": {
    "id": 15,
    "customer_id": null,
    "name": "Ravi",
    "email": "ravi@example.com",
    "phone": "9876543210",
    "address": "12 Lake Road",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001",
    "alternative_address": null,
    "requirement": "Need a 6 seat teak dining table",
    "reference_image": "/uploads/custom-requirements/table.jpg",
    "created_at": "2026-10-08T04:00:00.000Z",
    "updated_at": "2026-10-08T04:00:00.000Z"
  }
}
```

`customer_id` is `null` on this public route because customer authentication is not applied here.

---

# Customer APIs

Customer routes use the customer JWT unless the endpoint is marked public.

Customer object returned by register, login, Google login, and `GET /api/customer/auth/profile`:

```json
{
  "id": 8,
  "name": "Asha",
  "email": "asha@example.com",
  "google_id": null,
  "phone": "9876543210",
  "status": "ACTIVE",
  "created_at": "2026-10-01T10:00:00.000Z",
  "updated_at": "2026-10-01T10:00:00.000Z"
}
```

The password is never returned. This auth profile does not include `profile_image`. Use the profile routes below when the image is needed.

## Auth

### Register

`POST /api/customer/auth/register`

Public.

```json
{
  "name": "Asha",
  "email": "asha@example.com",
  "phone": "9876543210",
  "password": "Asha1234",
  "confirm_password": "Asha1234"
}
```

| Field | Required | Rules |
| --- | --- | --- |
| `name` | Yes | 2 to 150 characters |
| `email` | Yes | Valid email, stored in lowercase |
| `phone` | No | 7 to 20 characters: digits, `+`, `-`, spaces, parentheses |
| `password` | Yes | At least 8 characters, one uppercase, one lowercase, one number |
| `confirm_password` | Yes | Must match `password` |

Response `201`:

```json
{
  "success": true,
  "message": "Customer registered successfully",
  "token": "jwt-token",
  "customer": {}
}
```

Response `409`: `An account with this email already exists`.

### Login

`POST /api/customer/auth/login`

Public.

```json
{
  "email": "asha@example.com",
  "password": "Asha1234"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Customer login successful",
  "token": "jwt-token",
  "customer": {}
}
```

Response `401`: `Invalid email or password`.

Response `403`: `Your account is inactive. Please contact support.`

### Continue with Google

`POST /api/customer/auth/google`

Public.

```json
{
  "id_token": "google-id-token"
}
```

The token is verified with `GOOGLE_CLIENT_ID`. The Google email must be verified.

Response `200` for an existing Google user:

```json
{
  "success": true,
  "message": "Google login successful",
  "token": "jwt-token",
  "customer": {}
}
```

Response `200` when an email/password account is linked:

```json
{
  "success": true,
  "message": "Google account linked and login successful",
  "token": "jwt-token",
  "customer": {}
}
```

Response `201` for a new Google customer:

```json
{
  "success": true,
  "message": "Google account registered and login successful",
  "token": "jwt-token",
  "customer": {}
}
```

Response `400`: `Google ID token is required`.

Response `401`: `Invalid Google authentication token`, `Google account email could not be verified`, or `Google authentication failed`.

Response `403`: inactive account.

### Get auth profile

`GET /api/customer/auth/profile`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Customer profile fetched successfully",
  "customer": {
    "id": 8,
    "name": "Asha",
    "email": "asha@example.com",
    "google_id": null,
    "phone": "9876543210",
    "status": "ACTIVE",
    "created_at": "2026-10-01T10:00:00.000Z",
    "updated_at": "2026-10-01T10:00:00.000Z"
  }
}
```

## Forgot password

These three steps are public. Steps 2 and 3 depend on httpOnly cookies set by the previous step. The browser must send cookies (`forgot_password_email`, then `password_reset_token`). Each cookie lasts 10 minutes, is `httpOnly`, uses `sameSite: strict`, and is `secure` in production.

### Step 1 — send OTP

`POST /api/customer/auth/forgot-password`

```json
{
  "email": "asha@example.com"
}
```

Response `200` when the account exists:

```json
{
  "success": true,
  "message": "OTP has been sent to your registered email."
}
```

Response `200` when no account exists (the email is not revealed):

```json
{
  "success": true,
  "message": "If an account exists with this email, an OTP has been sent."
}
```

The email is saved in the `forgot_password_email` cookie.

### Step 2 — verify OTP

`POST /api/customer/auth/verify-otp`

The email is read from the `forgot_password_email` cookie. Do not send the email in the body.

```json
{
  "otp": "123456"
}
```

`otp` must be exactly 6 digits.

Response `200`:

```json
{
  "success": true,
  "message": "OTP verified successfully. You can now change your password."
}
```

The email cookie is cleared and `password_reset_token` is set.

Response `400`: `A valid 6-digit OTP is required`, `Password reset session expired. Please request a new OTP.`, or an invalid/expired OTP message.

### Step 3 — set a new password

`POST /api/customer/auth/reset-password`

The reset token is read from the `password_reset_token` cookie.

```json
{
  "new_password": "Asha5678",
  "confirm_password": "Asha5678"
}
```

Password rules match registration: at least 8 characters, one uppercase, one lowercase, and one number. The two fields must match.

Response `200`:

```json
{
  "success": true,
  "message": "Password changed successfully. You can now login with your new password."
}
```

Response `400`: `Password reset session is invalid or expired.`

Response `403`: inactive account.

## Profile

### Get profile

`GET /api/customer/profile`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Customer profile fetched successfully",
  "customer": {
    "id": 8,
    "name": "Asha",
    "email": "asha@example.com",
    "google_id": null,
    "phone": "9876543210",
    "profile_image": "/uploads/customers/asha.jpg",
    "status": "ACTIVE",
    "created_at": "2026-10-01T10:00:00.000Z",
    "updated_at": "2026-10-01T10:00:00.000Z"
  }
}
```

### Update profile

`PUT /api/customer/profile`

Auth required. `Content-Type: multipart/form-data`

| Field | Required | Rules |
| --- | --- | --- |
| `name` | Yes | 2 to 150 characters |
| `profile_image` | No | File. If omitted, the current image is kept |

Response `200`:

```json
{
  "success": true,
  "message": "Customer profile updated successfully",
  "customer": {}
}
```

`customer` has the same fields as the get-profile response.

## Wishlist

### Add a product

`POST /api/customer/wishlist`

Auth required.

```json
{
  "product_id": 1
}
```

The product must exist and be `ACTIVE`.

Response `201`:

```json
{
  "success": true,
  "message": "Product added to wishlist successfully",
  "wishlist_id": 21,
  "product_id": 1
}
```

Response `409`: `Product is already in your wishlist`.

### Get wishlist

`GET /api/customer/wishlist`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Wishlist fetched successfully",
  "wishlist": [
    {
      "id": 21,
      "product_id": 1,
      "created_at": "2026-10-08T04:00:00.000Z",
      "name": "Oak Sofa",
      "brand": "Woodline",
      "main_image": "/uploads/products/sofa.jpg",
      "short_description": "Three seat sofa",
      "mrp": "45000.00",
      "selling_price": "39999.00",
      "material": "Wood",
      "wood_type": "Oak",
      "product_status": "ACTIVE",
      "category_id": 2,
      "category_name": "Sofas"
    }
  ]
}
```

### Check if a product is wishlisted

`GET /api/customer/wishlist/check/:productId`

Auth required.

Response `200`:

```json
{
  "success": true,
  "product_id": 1,
  "is_wishlisted": true,
  "wishlist_item": {
    "id": 21,
    "customer_id": 8,
    "product_id": 1,
    "created_at": "2026-10-08T04:00:00.000Z",
    "name": "Oak Sofa",
    "main_image": "/uploads/products/sofa.jpg",
    "selling_price": "39999.00",
    "mrp": "45000.00",
    "product_status": "ACTIVE"
  }
}
```

When the product is not wishlisted, `is_wishlisted` is `false` and `wishlist_item` is `null`.

### Remove a product

`DELETE /api/customer/wishlist/:productId`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Product removed from wishlist successfully",
  "product_id": 1
}
```

Response `404`: `Product is not in your wishlist`.

## Reviews

A customer can review an active product once. New reviews are stored as `APPROVED`.

### Add a review

`POST /api/customer/reviews`

Auth required.

```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Very comfortable and well finished"
}
```

| Field | Rules |
| --- | --- |
| `product_id` | Positive integer. Product must be `ACTIVE` |
| `rating` | Whole number from `1` to `5` |
| `comment` | Required. 3 to 2000 characters |

Response `201`:

```json
{
  "success": true,
  "message": "Review added successfully",
  "review_id": 3
}
```

Response `409`: `You have already reviewed this product`.

### Get my reviews

`GET /api/customer/reviews/my`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Your reviews fetched successfully",
  "reviews": [
    {
      "id": 3,
      "product_id": 1,
      "rating": 5,
      "comment": "Very comfortable and well finished",
      "status": "APPROVED",
      "created_at": "2026-10-08T04:00:00.000Z",
      "updated_at": "2026-10-08T04:00:00.000Z",
      "product_name": "Oak Sofa",
      "main_image": "/uploads/products/sofa.jpg",
      "selling_price": "39999.00",
      "mrp": "45000.00"
    }
  ]
}
```

### Update my review

`PUT /api/customer/reviews/:id`

Auth required.

```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

`rating` and `comment` use the same rules as create. The review must belong to the logged-in customer.

Response `200`:

```json
{
  "success": true,
  "message": "Review updated successfully",
  "review": {
    "id": 3,
    "customer_id": 8,
    "product_id": 1,
    "rating": 4,
    "comment": "Updated comment",
    "status": "APPROVED",
    "created_at": "2026-10-08T04:00:00.000Z",
    "updated_at": "2026-10-08T05:00:00.000Z"
  }
}
```

Response `403`: `You can only edit your own review`.

### Delete my review

`DELETE /api/customer/reviews/:id`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

Response `403`: `You can only delete your own review`.

## Cart

The cart is built from active products and active variants. Quantity cannot exceed current stock. Adding the same product and variant again increases the existing quantity.

### Add to cart

`POST /api/customer/cart`

Auth required.

```json
{
  "product_id": 1,
  "variant_id": 4,
  "quantity": 2
}
```

All three values must be positive whole numbers. The variant must belong to the product.

Response `201` for a new line:

```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "cart_item_id": 11,
  "quantity": 2
}
```

Response `200` when the line already exists:

```json
{
  "success": true,
  "message": "Cart quantity updated successfully",
  "cart_item_id": 11,
  "quantity": 4
}
```

Response `400` examples: unavailable product or variant, variant does not belong to the product, out of stock, or `Only 3 items are available in stock`.

### Get my cart

`GET /api/customer/cart`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "cart": {
    "total_items": 2,
    "subtotal": 79998,
    "items": [
      {
        "cart_item_id": 11,
        "product_id": 1,
        "variant_id": 4,
        "quantity": 2,
        "product_name": "Oak Sofa",
        "brand": "Woodline",
        "main_image": "/uploads/products/sofa.jpg",
        "mrp": "45000.00",
        "selling_price": "39999.00",
        "product_status": "ACTIVE",
        "variant_name": "Walnut",
        "color": "Brown",
        "stock_quantity": 8,
        "variant_status": "ACTIVE",
        "item_subtotal": "79998.00"
      }
    ]
  }
}
```

`item_subtotal` is `selling_price * quantity`. `total_items` is the sum of quantities.

### Update quantity

`PATCH /api/customer/cart/:id`

Auth required. `:id` is the cart item id.

```json
{
  "quantity": 1
}
```

`quantity` must be a positive whole number and cannot exceed stock.

Response `200`:

```json
{
  "success": true,
  "message": "Cart quantity updated successfully",
  "cart_item_id": 11,
  "quantity": 1
}
```

Response `404`: `Cart item not found`.

### Remove one item

`DELETE /api/customer/cart/:id`

Auth required. Request body: none. `:id` is the cart item id.

Response `200`:

```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

### Clear the cart

`DELETE /api/customer/cart`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

## Orders

An order is created from the logged-in customer's cart. Discount is currently always `0`. Shipping uses the first store-settings row: if there is no settings row, shipping is `0`; if the free-shipping threshold is `0` or the cart subtotal is below that threshold, the configured shipping charge is applied; otherwise shipping is `0`.

`total_amount = subtotal - discount_amount + shipping_charge`.

New orders are saved as `payment_status: PENDING` and `order_status: PENDING`. Stock is reduced and the cart is cleared. A customer notification of type `NEW_ORDER` is created.

### Place an order

`POST /api/customer/orders`

Auth required.

```json
{
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "customer_phone": "9876543210",
  "shipping_address": "12 Lake Road",
  "shipping_city": "Chennai",
  "shipping_state": "Tamil Nadu",
  "shipping_pincode": "600001",
  "alternative_address": "Near the park",
  "payment_method": "COD",
  "notes": "Call before delivery"
}
```

| Field | Required | Rules |
| --- | --- | --- |
| `customer_name` | Yes | |
| `customer_email` | Yes | |
| `customer_phone` | Yes | |
| `shipping_address` | Yes | |
| `shipping_city` | Yes | |
| `shipping_state` | Yes | |
| `shipping_pincode` | Yes | |
| `alternative_address` | No | |
| `payment_method` | No | `COD` or `ONLINE`. Default `COD` |
| `notes` | No | |

Response `201`:

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order_id": 44,
    "order_number": "ORD-generated-number",
    "subtotal": 79998,
    "discount_amount": 0,
    "shipping_charge": 499,
    "total_amount": 80497,
    "payment_method": "COD",
    "payment_status": "PENDING",
    "order_status": "PENDING"
  }
}
```

### Get my orders

`GET /api/customer/orders`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 44,
      "order_number": "ORD-generated-number",
      "customer_id": 8,
      "customer_name": "Asha",
      "customer_email": "asha@example.com",
      "customer_phone": "9876543210",
      "shipping_address": "12 Lake Road",
      "shipping_city": "Chennai",
      "shipping_state": "Tamil Nadu",
      "shipping_pincode": "600001",
      "alternative_address": "Near the park",
      "subtotal": "79998.00",
      "discount_amount": "0.00",
      "shipping_charge": "499.00",
      "total_amount": "80497.00",
      "payment_method": "COD",
      "payment_status": "PENDING",
      "order_status": "PENDING",
      "notes": "Call before delivery",
      "created_at": "2026-10-08T04:00:00.000Z",
      "updated_at": "2026-10-08T04:00:00.000Z"
    }
  ]
}
```

This list does not include line items. Use the order-by-id route for items.

### Get my order by id

`GET /api/customer/orders/:id`

Auth required. The order must belong to the logged-in customer.

Response `200`:

```json
{
  "success": true,
  "data": {
    "id": 44,
    "order_number": "ORD-generated-number",
    "customer_id": 8,
    "customer_name": "Asha",
    "customer_email": "asha@example.com",
    "customer_phone": "9876543210",
    "shipping_address": "12 Lake Road",
    "shipping_city": "Chennai",
    "shipping_state": "Tamil Nadu",
    "shipping_pincode": "600001",
    "alternative_address": "Near the park",
    "subtotal": "79998.00",
    "discount_amount": "0.00",
    "shipping_charge": "499.00",
    "total_amount": "80497.00",
    "payment_method": "COD",
    "payment_status": "PENDING",
    "order_status": "PENDING",
    "notes": "Call before delivery",
    "created_at": "2026-10-08T04:00:00.000Z",
    "updated_at": "2026-10-08T04:00:00.000Z",
    "items": [
      {
        "id": 70,
        "order_id": 44,
        "product_id": 1,
        "variant_id": 4,
        "product_name": "Oak Sofa",
        "variant_name": "Walnut",
        "color": "Brown",
        "quantity": 2,
        "unit_price": "39999.00",
        "subtotal": "79998.00",
        "created_at": "2026-10-08T04:00:00.000Z"
      }
    ]
  }
}
```

Response `404`: `Order not found`.

### Cancel my order

`PATCH /api/customer/orders/:id/cancel`

Auth required. Request body: none.

Cancellation is allowed only while status is `PENDING`, `CONFIRMED`, or `PROCESSING`. Stock is restored and an `ORDER_CANCELLED` notification is created.

Response `200`:

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order_id": 44,
    "order_number": "ORD-generated-number",
    "order_status": "CANCELLED"
  }
}
```

Response `400`: the order can no longer be cancelled.

Response `404`: `Order not found`.

## Customization requests

A logged-in customer can ask to customize an existing product or request a new product. The customer response does not include `status`, `admin_reply`, or `additional_cost`. Those fields are visible on the admin APIs.

### Create a request

`POST /api/customer/customization-requests`

Auth required. `Content-Type: multipart/form-data`

| Field | Required | Rules |
| --- | --- | --- |
| `request_type` | Yes | `EXISTING_PRODUCT` or `NEW_PRODUCT` |
| `product_id` | Required for `EXISTING_PRODUCT` | Positive integer. Product must be `ACTIVE`. Must be omitted or ignored for `NEW_PRODUCT` (stored as `null`) |
| `customer_requirement` | Yes | 5 to 5000 characters |
| `customer_image` | No | File |

Response `201`:

```json
{
  "success": true,
  "message": "Customization request submitted successfully",
  "request": {
    "id": 9,
    "customer_id": 8,
    "request_type": "EXISTING_PRODUCT",
    "product_id": 1,
    "product_name": "Oak Sofa",
    "product_image": "/uploads/products/sofa.jpg",
    "customer_requirement": "Please make this sofa in teak",
    "customer_image": "/uploads/customization/ref.jpg",
    "created_at": "2026-10-08T04:00:00.000Z",
    "updated_at": "2026-10-08T04:00:00.000Z"
  }
}
```

The request is stored with status `PENDING`.

### Get my requests

`GET /api/customer/customization-requests`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Customization requests fetched successfully",
  "count": 1,
  "requests": []
}
```

Each item uses the same fields as the create response `request` object.

### Get my request by id

`GET /api/customer/customization-requests/:id`

Auth required. Only the owner's request is returned.

Response `200`:

```json
{
  "success": true,
  "message": "Customization request fetched successfully",
  "request": {}
}
```

Response `404`: `Customization request not found`.

### Update my request

`PUT /api/customer/customization-requests/:id`

Auth required. `Content-Type: multipart/form-data`

The customer can change only:

| Field | Rules |
| --- | --- |
| `customer_requirement` | 5 to 5000 characters when sent |
| `customer_image` | Optional replacement file |

The customer cannot change `status`, `admin_reply`, `additional_cost`, `request_type`, or `product_id`. Update is allowed only while the stored status is `PENDING`.

Response `200`:

```json
{
  "success": true,
  "message": "Customization request updated successfully",
  "request": {}
}
```

Response `400`: `Only pending customization requests can be updated`.

## Notifications

Customer notifications are filtered by the logged-in customer id.

Notification object:

```json
{
  "id": 5,
  "type": "NEW_ORDER",
  "title": "Order Placed Successfully",
  "message": "Your order ORD-1001 has been placed successfully.",
  "reference_type": "ORDER",
  "reference_id": 44,
  "is_read": 0,
  "created_at": "2026-10-08T04:00:00.000Z"
}
```

`is_read` is `0` or `1`.

### Get all my notifications

`GET /api/customer/notifications`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": []
}
```

### Get unread notifications

`GET /api/customer/notifications/unread`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": []
}
```

### Get unread count

`GET /api/customer/notifications/unread-count`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "data": {
    "unread_count": 1
  }
}
```

### Get one notification

`GET /api/customer/notifications/:id`

Auth required. The notification must belong to the customer.

Response `200`:

```json
{
  "success": true,
  "data": {}
}
```

Response `404`: notification not found.

### Mark one as read

`PATCH /api/customer/notifications/:id/read`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark all as read

`PATCH /api/customer/notifications/read-all`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "updated_count": 3
}
```

### Delete one notification

`DELETE /api/customer/notifications/:id`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

# Admin APIs

Every admin route except login requires:

```
Authorization: Bearer <admin-token>
```

## Auth

### Login

`POST /api/admin/auth/login`

Public.

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "jwt-token",
  "admin": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "status": "ACTIVE"
  }
}
```

Response `400`: `Email and password are required`.

Response `401`: `Invalid email or password`.

Response `403`: `Admin account is inactive`.

### Get login profile

`GET /api/admin/auth/profile`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Admin profile fetched successfully",
  "admin": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

## Settings and admin account

### Get settings profile

`GET /api/admin/settings/profile`

Auth required. Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Admin profile fetched successfully",
  "profile": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

### Update settings profile

`PUT /api/admin/settings/profile`

Auth required.

```json
{
  "name": "Store Admin",
  "email": "admin@example.com"
}
```

`name` is 2 to 100 characters. `email` must be a valid address and unique.

Response `200`:

```json
{
  "success": true,
  "message": "Admin profile updated successfully",
  "profile": {}
}
```

Response `409`: `Email address is already in use`.

### Change password

`PUT /api/admin/settings/change-password`

Auth required.

```json
{
  "current_password": "OldPass123",
  "new_password": "NewPass123",
  "confirm_password": "NewPass123"
}
```

The new password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one number, match `confirm_password`, and differ from the current password.

Response `200`:

```json
{
  "success": true,
  "message": "Admin password changed successfully"
}
```

Response `401`: `Current password is incorrect`.

### Get store settings

`GET /api/admin/settings/store`

Auth required. Request body: none.

If no settings row exists, the API creates defaults: shipping charge `499`, free-shipping threshold `10000`, delivery days `6`, COD enabled, online payment enabled.

Response `200`:

```json
{
  "success": true,
  "message": "Settings fetched successfully",
  "settings": {
    "id": 1,
    "shipping_charge": "499.00",
    "free_shipping_threshold": "10000.00",
    "default_delivery_days": 6,
    "cod_enabled": 1,
    "online_payment_enabled": 1,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

### Update store settings

`PUT /api/admin/settings/store`

Auth required.

```json
{
  "shipping_charge": 499,
  "free_shipping_threshold": 10000,
  "default_delivery_days": 6,
  "cod_enabled": true,
  "online_payment_enabled": true
}
```

| Field | Rules |
| --- | --- |
| `shipping_charge` | Required. Number `0` or greater |
| `free_shipping_threshold` | Required. Number `0` or greater |
| `default_delivery_days` | Required. Whole number greater than `0` |
| `cod_enabled` | `true`, `false`, `1`, or `0` |
| `online_payment_enabled` | `true`, `false`, `1`, or `0` |

At least one payment method must stay enabled. Booleans are stored as `1` or `0`.

Response `200`:

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {}
}
```

## Categories

Category object:

```json
{
  "id": 2,
  "name": "Sofas",
  "description": "Living room sofas",
  "image": "image-url-or-path",
  "status": "ACTIVE",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z"
}
```

### Create a category

`POST /api/admin/categories`

```json
{
  "name": "Sofas",
  "description": "Living room sofas",
  "image": "https://example.com/sofas.jpg"
}
```

`name` is required. `description` and `image` are optional. `image` is a text value, not a file upload.

Response `201`:

```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {}
}
```

Response `409`: `Category name already exists`.

### Get all categories

`GET /api/admin/categories`

Request body: none. Includes active and inactive categories.

Response `200`:

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "categories": []
}
```

### Get a category

`GET /api/admin/categories/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Category fetched successfully",
  "category": {}
}
```

Response `404`: `Category not found`.

### Update a category

`PUT /api/admin/categories/:id`

```json
{
  "name": "Sofas",
  "description": "Updated description",
  "image": "https://example.com/sofas.jpg"
}
```

`name` is required.

Response `200`:

```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {}
}
```

### Change category status

`PATCH /api/admin/categories/:id/status`

```json
{
  "status": "INACTIVE"
}
```

`status` must be `ACTIVE` or `INACTIVE`.

Response `200`:

```json
{
  "success": true,
  "message": "Category inactive successfully",
  "category": {}
}
```

The message uses the lowercase status (`active` or `inactive`).

### Delete a category

`DELETE /api/admin/categories/:id`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Products

Admin product object:

```json
{
  "id": 1,
  "category_id": 2,
  "category_name": "Sofas",
  "name": "Oak Sofa",
  "brand": "Woodline",
  "main_image": "/uploads/products/sofa.jpg",
  "short_description": "Three seat sofa",
  "description": "Full description",
  "mrp": "45000.00",
  "selling_price": "39999.00",
  "material": "Wood",
  "wood_type": "Oak",
  "length": "210.00",
  "width": "90.00",
  "height": "85.00",
  "weight": "42.00",
  "seating_capacity": 3,
  "assembly_required": "NO",
  "delivery_days": 6,
  "status": "ACTIVE",
  "created_at": "2026-10-01T10:00:00.000Z",
  "updated_at": "2026-10-01T10:00:00.000Z"
}
```

### Create a product

`POST /api/admin/products`

`Content-Type: multipart/form-data`

| Field | Required | Rules |
| --- | --- | --- |
| `category_id` | Yes | Category must exist and be `ACTIVE` |
| `name` | Yes | |
| `mrp` | Yes | Number `0` or greater |
| `selling_price` | Yes | Number `0` or greater, and not greater than `mrp` |
| `main_image` | Yes | File |
| `brand` | No | |
| `short_description` | No | |
| `description` | No | |
| `material` | No | |
| `wood_type` | No | |
| `length` | No | |
| `width` | No | |
| `height` | No | |
| `weight` | No | |
| `seating_capacity` | No | |
| `assembly_required` | No | `YES` or `NO`. Default `NO` |
| `delivery_days` | No | Whole number greater than `0`. Default `6` |

Response `201`:

```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {}
}
```

Response `400`: `Main product image is required`, `Selling price cannot be greater than MRP`, or `Cannot create product under an inactive category`.

Response `404`: `Category not found`.

### Get all products

`GET /api/admin/products`

Request body: none. Includes inactive products.

Response `200`:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "products": []
}
```

### Get a product

`GET /api/admin/products/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "product": {}
}
```

Response `400`: `Valid product ID is required`.

Response `404`: `Product not found`.

### Update a product

`PUT /api/admin/products/:id`

`Content-Type: multipart/form-data`

Same fields as create. `main_image` is optional; if omitted, the current image stays. If `delivery_days` is omitted, the existing value is kept.

The category must exist and be `ACTIVE`.

Response `200`:

```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {}
}
```

### Change product status

`PATCH /api/admin/products/:id/status`

```json
{
  "status": "INACTIVE"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Product inactive successfully",
  "product": {}
}
```

### Delete a product

`DELETE /api/admin/products/:id`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Product variants

Single variant object:

```json
{
  "id": 4,
  "product_id": 1,
  "product_name": "Oak Sofa",
  "variant_name": "Walnut",
  "color": "Brown",
  "stock_quantity": 8,
  "status": "ACTIVE",
  "availability_status": "AVAILABLE",
  "created_at": "2026-10-01T10:00:00.000Z",
  "updated_at": "2026-10-01T10:00:00.000Z"
}
```

`availability_status` is `INACTIVE` when the variant is inactive, `SOLD OUT` when stock is `0`, otherwise `AVAILABLE`.

The list endpoint (`/product/:productId`) returns the same fields except `product_name`.

### Create a variant

`POST /api/admin/product-variants`

```json
{
  "product_id": 1,
  "variant_name": "Walnut",
  "color": "Brown",
  "stock_quantity": 8
}
```

| Field | Required | Rules |
| --- | --- | --- |
| `product_id` | Yes | Product must exist and be `ACTIVE` |
| `variant_name` | Yes | Unique for that product |
| `color` | No | |
| `stock_quantity` | Yes | Whole number `0` or greater |

Response `201`:

```json
{
  "success": true,
  "message": "Product variant created successfully",
  "variant": {}
}
```

Response `409`: `This variant already exists for this product`.

### Get variants for a product

`GET /api/admin/product-variants/product/:productId`

Response `200`:

```json
{
  "success": true,
  "message": "Product variants fetched successfully",
  "product": {
    "id": 1,
    "name": "Oak Sofa",
    "main_image": "/uploads/products/sofa.jpg"
  },
  "variants": []
}
```

Response `404`: `Product not found`.

### Get one variant

`GET /api/admin/product-variants/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Product variant fetched successfully",
  "variant": {}
}
```

### Update a variant

`PUT /api/admin/product-variants/:id`

```json
{
  "variant_name": "Walnut",
  "color": "Dark Brown",
  "stock_quantity": 10
}
```

`variant_name` is required. `stock_quantity` must be a whole number `0` or greater. The name must stay unique for the product.

Response `200`:

```json
{
  "success": true,
  "message": "Product variant updated successfully",
  "variant": {}
}
```

### Update stock only

`PATCH /api/admin/product-variants/:id/stock`

```json
{
  "stock_quantity": 12
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Variant stock updated successfully",
  "variant": {}
}
```

### Change variant status

`PATCH /api/admin/product-variants/:id/status`

```json
{
  "status": "INACTIVE"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Variant inactive successfully",
  "variant": {}
}
```

The message uses the lowercase status (`active` or `inactive`).

### Delete a variant

`DELETE /api/admin/product-variants/:id`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Product variant deleted successfully"
}
```

## Product gallery images

Image object:

```json
{
  "id": 10,
  "product_id": 1,
  "product_name": "Oak Sofa",
  "image": "/uploads/products/gallery.jpg",
  "image_title": "Side view",
  "sort_order": 1,
  "created_at": "2026-10-01T10:00:00.000Z"
}
```

The list endpoint does not include `product_name`.

### Add a gallery image

`POST /api/admin/product-images`

`Content-Type: multipart/form-data`

| Field | Required | Rules |
| --- | --- | --- |
| `product_id` | Yes | Product must exist and be `ACTIVE` |
| `image` | Yes | File |
| `image_title` | No | |
| `sort_order` | No | Whole number `0` or greater. Default `0` |

Response `201`:

```json
{
  "success": true,
  "message": "Product gallery image added successfully",
  "image": {}
}
```

### Get images for a product

`GET /api/admin/product-images/product/:productId`

Response `200`:

```json
{
  "success": true,
  "message": "Product gallery images fetched successfully",
  "product": {
    "id": 1,
    "name": "Oak Sofa",
    "main_image": "/uploads/products/sofa.jpg"
  },
  "images": []
}
```

### Get one image

`GET /api/admin/product-images/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Product image fetched successfully",
  "image": {}
}
```

### Update title or sort order

`PUT /api/admin/product-images/:id`

JSON body. This route does not replace the file.

```json
{
  "image_title": "Front view",
  "sort_order": 2
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Product image updated successfully",
  "image": {}
}
```

### Delete an image

`DELETE /api/admin/product-images/:id`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Product image deleted successfully"
}
```

## Offers

Offer object:

```json
{
  "id": 1,
  "title": "Festive Sale",
  "description": "Limited period offer",
  "image": "/uploads/products/offer.jpg",
  "discount_type": "PERCENTAGE",
  "discount_value": "10.00",
  "start_date": "2026-10-01",
  "end_date": "2026-10-31",
  "status": "ACTIVE",
  "created_at": "2026-10-01T10:00:00.000Z",
  "updated_at": "2026-10-01T10:00:00.000Z"
}
```

### Create an offer

`POST /api/admin/offers`

`Content-Type: multipart/form-data`

| Field | Required | Rules |
| --- | --- | --- |
| `title` | Yes | |
| `discount_type` | Yes | `PERCENTAGE` or `FIXED` |
| `discount_value` | Yes | Number greater than `0`. Percentage cannot exceed `100` |
| `start_date` | Yes | Valid date. `end_date` cannot be before `start_date` |
| `end_date` | Yes | Valid date |
| `description` | No | |
| `image` | No | File |

Response `201`:

```json
{
  "success": true,
  "message": "Offer created successfully",
  "offer": {}
}
```

### Get all offers

`GET /api/admin/offers`

Request body: none. Includes inactive and expired offers.

Response `200`:

```json
{
  "success": true,
  "message": "Offers fetched successfully",
  "offers": []
}
```

### Get one offer

`GET /api/admin/offers/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Offer fetched successfully",
  "offer": {}
}
```

### Update an offer

`PUT /api/admin/offers/:id`

`Content-Type: multipart/form-data`

Same fields as create. `image` is optional.

Response `200`:

```json
{
  "success": true,
  "message": "Offer updated successfully",
  "offer": {}
}
```

### Change offer status

`PATCH /api/admin/offers/:id/status`

```json
{
  "status": "INACTIVE"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Offer inactive successfully",
  "offer": {}
}
```

The message uses the lowercase status (`active` or `inactive`).

### Delete an offer

`DELETE /api/admin/offers/:id`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Offer deleted successfully"
}
```

## Orders

Order list item:

```json
{
  "id": 44,
  "order_number": "ORD-1001",
  "customer_id": 8,
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "customer_phone": "9876543210",
  "subtotal": "79998.00",
  "discount_amount": "0.00",
  "shipping_charge": "499.00",
  "total_amount": "80497.00",
  "payment_method": "COD",
  "payment_status": "PENDING",
  "order_status": "PENDING",
  "created_at": "2026-10-08T04:00:00.000Z",
  "updated_at": "2026-10-08T04:00:00.000Z"
}
```

### Get all orders

`GET /api/admin/orders`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "orders": []
}
```

### Get one order

`GET /api/admin/orders/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Order fetched successfully",
  "order": {
    "id": 44,
    "order_number": "ORD-1001",
    "customer_id": 8,
    "customer_name": "Asha",
    "customer_email": "asha@example.com",
    "customer_phone": "9876543210",
    "shipping_address": "12 Lake Road",
    "shipping_city": "Chennai",
    "shipping_state": "Tamil Nadu",
    "shipping_pincode": "600001",
    "subtotal": "79998.00",
    "discount_amount": "0.00",
    "shipping_charge": "499.00",
    "total_amount": "80497.00",
    "payment_method": "COD",
    "payment_status": "PENDING",
    "order_status": "PENDING",
    "notes": "Call before delivery",
    "created_at": "2026-10-08T04:00:00.000Z",
    "updated_at": "2026-10-08T04:00:00.000Z",
    "items": [
      {
        "id": 70,
        "order_id": 44,
        "product_id": 1,
        "variant_id": 4,
        "product_name": "Oak Sofa",
        "variant_name": "Walnut",
        "color": "Brown",
        "quantity": 2,
        "unit_price": "39999.00",
        "subtotal": "79998.00",
        "created_at": "2026-10-08T04:00:00.000Z"
      }
    ]
  }
}
```

The admin order detail does not include `alternative_address`.

### Update order status

`PATCH /api/admin/orders/:id/status`

```json
{
  "order_status": "CONFIRMED"
}
```

Allowed values: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`.

A `DELIVERED` or `CANCELLED` order cannot be changed.

Response `200`:

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {}
}
```

Response `400` for an invalid status also returns `allowed_statuses`.

## Customers

Customer list fields:

```json
{
  "id": 8,
  "name": "Asha",
  "email": "asha@example.com",
  "phone": "9876543210",
  "status": "ACTIVE",
  "created_at": "2026-10-01T10:00:00.000Z",
  "updated_at": "2026-10-01T10:00:00.000Z",
  "total_orders": 2,
  "total_amount_spent": "80497.00",
  "last_order_date": "2026-10-08T04:00:00.000Z"
}
```

`total_amount_spent` ignores cancelled orders.

### Get all customers

`GET /api/admin/customers`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Customers fetched successfully",
  "customers": []
}
```

### Get one customer with orders

`GET /api/admin/customers/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Customer fetched successfully",
  "customer": {
    "id": 8,
    "name": "Asha",
    "email": "asha@example.com",
    "phone": "9876543210",
    "status": "ACTIVE",
    "created_at": "2026-10-01T10:00:00.000Z",
    "updated_at": "2026-10-01T10:00:00.000Z",
    "total_orders": 1,
    "total_amount_spent": "80497.00",
    "last_order_date": "2026-10-08T04:00:00.000Z",
    "orders": [
      {
        "id": 44,
        "order_number": "ORD-1001",
        "customer_name": "Asha",
        "customer_email": "asha@example.com",
        "customer_phone": "9876543210",
        "shipping_address": "12 Lake Road",
        "shipping_city": "Chennai",
        "shipping_state": "Tamil Nadu",
        "shipping_pincode": "600001",
        "subtotal": "79998.00",
        "discount_amount": "0.00",
        "shipping_charge": "499.00",
        "total_amount": "80497.00",
        "payment_method": "COD",
        "payment_status": "PENDING",
        "order_status": "PENDING",
        "notes": null,
        "created_at": "2026-10-08T04:00:00.000Z",
        "updated_at": "2026-10-08T04:00:00.000Z",
        "items": [
          {
            "id": 70,
            "order_id": 44,
            "product_id": 1,
            "variant_id": 4,
            "product_name": "Oak Sofa",
            "variant_name": "Walnut",
            "color": "Brown",
            "quantity": 2,
            "unit_price": "39999.00",
            "subtotal": "79998.00",
            "main_image": "/uploads/products/sofa.jpg"
          }
        ]
      }
    ]
  }
}
```

### Change customer status

`PATCH /api/admin/customers/:id/status`

```json
{
  "status": "INACTIVE"
}
```

`status` must be `ACTIVE` or `INACTIVE`.

Response `200`:

```json
{
  "success": true,
  "message": "Customer status changed to INACTIVE",
  "customer": {}
}
```

`customer` is the full customer-with-orders object.

## Inventory

Inventory row:

```json
{
  "variant_id": 4,
  "product_id": 1,
  "product_name": "Oak Sofa",
  "main_image": "/uploads/products/sofa.jpg",
  "category_id": 2,
  "category_name": "Sofas",
  "variant_name": "Walnut",
  "color": "Brown",
  "stock_quantity": 8,
  "variant_status": "ACTIVE",
  "product_status": "ACTIVE",
  "availability_status": "AVAILABLE",
  "created_at": "2026-10-01T10:00:00.000Z",
  "updated_at": "2026-10-01T10:00:00.000Z"
}
```

Low-stock and out-of-stock lists omit `created_at`. Low stock means an active variant with stock from `1` to `5`. Out of stock means an active variant with stock `0`.

### Get all inventory

`GET /api/admin/inventory`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Inventory fetched successfully",
  "inventory": []
}
```

### Get inventory summary

`GET /api/admin/inventory/summary`

Request body: none.

Response `200`:

```json
{
  "success": true,
  "message": "Inventory summary fetched successfully",
  "summary": {
    "total_variants": 20,
    "total_stock_quantity": "140",
    "available_variants": "12",
    "low_stock_variants": "3",
    "out_of_stock_variants": "2",
    "inactive_variants": "3"
  }
}
```

### Get low stock

`GET /api/admin/inventory/low-stock`

Response `200`:

```json
{
  "success": true,
  "message": "Low stock inventory fetched successfully",
  "inventory": []
}
```

### Get out of stock

`GET /api/admin/inventory/out-of-stock`

Response `200`:

```json
{
  "success": true,
  "message": "Out of stock inventory fetched successfully",
  "inventory": []
}
```

### Get inventory for one product

`GET /api/admin/inventory/product/:productId`

Response `200`:

```json
{
  "success": true,
  "message": "Product inventory fetched successfully",
  "inventory": {
    "id": 1,
    "name": "Oak Sofa",
    "brand": "Woodline",
    "main_image": "/uploads/products/sofa.jpg",
    "status": "ACTIVE",
    "category_id": 2,
    "category_name": "Sofas",
    "variants": [
      {
        "variant_id": 4,
        "product_id": 1,
        "variant_name": "Walnut",
        "color": "Brown",
        "stock_quantity": 8,
        "status": "ACTIVE",
        "availability_status": "AVAILABLE",
        "created_at": "2026-10-01T10:00:00.000Z",
        "updated_at": "2026-10-01T10:00:00.000Z"
      }
    ]
  }
}
```

### Update variant stock

`PATCH /api/admin/inventory/variant/:variantId/stock`

```json
{
  "stock_quantity": 15
}
```

`stock_quantity` must be a whole number `0` or greater.

Response `200`:

```json
{
  "success": true,
  "message": "Variant stock updated successfully",
  "inventory": {
    "variant_id": 4,
    "product_id": 1,
    "variant_name": "Walnut",
    "color": "Brown",
    "stock_quantity": 15,
    "status": "ACTIVE",
    "product_name": "Oak Sofa",
    "main_image": "/uploads/products/sofa.jpg",
    "category_id": 2,
    "category_name": "Sofas",
    "availability_status": "AVAILABLE"
  }
}
```

## Dashboard

All dashboard routes are `GET` and have no request body.

### Summary

`GET /api/admin/dashboard/summary`

```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "summary": {
    "total_orders": 40,
    "pending_orders": 5,
    "processing_orders": 3,
    "delivered_orders": 20,
    "cancelled_orders": 2,
    "active_products": 30,
    "inactive_products": 4,
    "active_categories": 6,
    "out_of_stock_variants": 2
  }
}
```

### Order status counts

`GET /api/admin/dashboard/order-status`

```json
{
  "success": true,
  "message": "Order status summary fetched successfully",
  "order_status": [
    {
      "order_status": "PENDING",
      "total_orders": 5
    }
  ]
}
```

### Revenue

`GET /api/admin/dashboard/revenue`

Cancelled orders are excluded.

```json
{
  "success": true,
  "message": "Revenue summary fetched successfully",
  "revenue": {
    "total_revenue": "500000.00",
    "today_revenue": "12000.00",
    "this_month_revenue": "80000.00",
    "this_year_revenue": "500000.00"
  }
}
```

### Today

`GET /api/admin/dashboard/today`

```json
{
  "success": true,
  "message": "Today summary fetched successfully",
  "today": {
    "today_orders": 3,
    "today_revenue": "12000.00",
    "products_added_today": 1,
    "variants_added_today": 2,
    "delivered_today": 1,
    "cancelled_today": 0
  }
}
```

### Low stock variants

`GET /api/admin/dashboard/low-stock`

Active variants with stock from `1` to `5`.

```json
{
  "success": true,
  "message": "Low stock variants fetched successfully",
  "total": 1,
  "variants": [
    {
      "id": 4,
      "product_id": 1,
      "product_name": "Oak Sofa",
      "main_image": "/uploads/products/sofa.jpg",
      "variant_name": "Walnut",
      "color": "Brown",
      "stock_quantity": 2,
      "status": "ACTIVE"
    }
  ]
}
```

### Out of stock variants

`GET /api/admin/dashboard/out-of-stock`

Same variant fields as low stock. `total` is included.

```json
{
  "success": true,
  "message": "Out of stock variants fetched successfully",
  "total": 1,
  "variants": []
}
```

### Recent orders

`GET /api/admin/dashboard/recent-orders`

Latest 10 orders.

```json
{
  "success": true,
  "message": "Recent orders fetched successfully",
  "orders": [
    {
      "id": 44,
      "order_number": "ORD-1001",
      "customer_name": "Asha",
      "customer_email": "asha@example.com",
      "total_amount": "80497.00",
      "payment_method": "COD",
      "payment_status": "PENDING",
      "order_status": "PENDING",
      "created_at": "2026-10-08T04:00:00.000Z"
    }
  ]
}
```

### Recent products

`GET /api/admin/dashboard/recent-products`

Latest 10 products.

```json
{
  "success": true,
  "message": "Recent products fetched successfully",
  "products": [
    {
      "id": 1,
      "name": "Oak Sofa",
      "brand": "Woodline",
      "main_image": "/uploads/products/sofa.jpg",
      "mrp": "45000.00",
      "selling_price": "39999.00",
      "status": "ACTIVE",
      "category_name": "Sofas",
      "created_at": "2026-10-01T10:00:00.000Z"
    }
  ]
}
```

### Best selling products

`GET /api/admin/dashboard/best-selling-products`

Top 10 by quantity. Cancelled orders are excluded.

```json
{
  "success": true,
  "message": "Best selling products fetched successfully",
  "products": [
    {
      "product_id": 1,
      "product_name": "Oak Sofa",
      "total_quantity_sold": "18",
      "total_sales": "700000.00"
    }
  ]
}
```

## Reports

Date-based reports require query `from` and `to` as `YYYY-MM-DD`. `from` cannot be after `to`.

Shared success shape:

```json
{
  "success": true,
  "message": "Sales report fetched successfully",
  "date_range": {
    "from": "2026-10-01",
    "to": "2026-10-08"
  },
  "total_records": 1,
  "report": []
}
```

The inventory report has no `date_range`.

Response `400`: `Both from and to dates are required`, `Invalid date format. Use YYYY-MM-DD`, or `From date cannot be greater than to date`.

### Sales report

`GET /api/admin/reports/sales?from=2026-10-01&to=2026-10-08`

Each row is one order item inside the date range:

```json
{
  "order_id": 44,
  "order_number": "ORD-1001",
  "order_date": "2026-10-08 09:30:00",
  "customer_id": 8,
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "customer_phone": "9876543210",
  "product_id": 1,
  "variant_id": 4,
  "product_name": "Oak Sofa",
  "variant_name": "Walnut",
  "color": "Brown",
  "quantity": 2,
  "unit_price": "39999.00",
  "item_subtotal": "79998.00",
  "discount_amount": "0.00",
  "shipping_charge": "499.00",
  "total_amount": "80497.00",
  "payment_method": "COD",
  "payment_status": "PENDING",
  "order_status": "PENDING"
}
```

### Orders report

`GET /api/admin/reports/orders?from=2026-10-01&to=2026-10-08`

```json
{
  "id": 44,
  "order_number": "ORD-1001",
  "customer_id": 8,
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "customer_phone": "9876543210",
  "shipping_city": "Chennai",
  "shipping_state": "Tamil Nadu",
  "shipping_pincode": "600001",
  "subtotal": "79998.00",
  "discount_amount": "0.00",
  "shipping_charge": "499.00",
  "total_amount": "80497.00",
  "payment_method": "COD",
  "payment_status": "PENDING",
  "order_status": "PENDING",
  "order_date": "2026-10-08 09:30:00"
}
```

### Products report

`GET /api/admin/reports/products?from=2026-10-01&to=2026-10-08`

Cancelled orders are excluded from the totals.

```json
{
  "product_id": 1,
  "product_name": "Oak Sofa",
  "brand": "Woodline",
  "category_id": 2,
  "category_name": "Sofas",
  "total_quantity_sold": "18",
  "total_sales": "700000.00",
  "total_orders": 6
}
```

### Customers report

`GET /api/admin/reports/customers?from=2026-10-01&to=2026-10-08`

```json
{
  "customer_id": 8,
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "customer_phone": "9876543210",
  "total_orders": 2,
  "total_items_purchased": 4,
  "total_amount_spent": "80497.00",
  "last_order_date": "2026-10-08T04:00:00.000Z"
}
```

`total_amount_spent` ignores cancelled orders. `total_orders` counts every order in the range.

### Inventory report

`GET /api/admin/reports/inventory`

No date query.

```json
{
  "success": true,
  "message": "Inventory report fetched successfully",
  "total_records": 1,
  "report": [
    {
      "variant_id": 4,
      "product_id": 1,
      "product_name": "Oak Sofa",
      "brand": "Woodline",
      "category_id": 2,
      "category_name": "Sofas",
      "variant_name": "Walnut",
      "color": "Brown",
      "stock_quantity": 8,
      "variant_status": "ACTIVE",
      "product_status": "ACTIVE",
      "availability_status": "AVAILABLE",
      "created_at": "2026-10-01T10:00:00.000Z",
      "updated_at": "2026-10-01T10:00:00.000Z"
    }
  ]
}
```

### Payments report

`GET /api/admin/reports/payments?from=2026-10-01&to=2026-10-08`

```json
{
  "order_id": 44,
  "order_number": "ORD-1001",
  "order_date": "2026-10-08 09:30:00",
  "customer_id": 8,
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "total_amount": "80497.00",
  "payment_method": "COD",
  "payment_status": "PENDING",
  "order_status": "PENDING"
}
```

### Categories report

`GET /api/admin/reports/categories?from=2026-10-01&to=2026-10-08`

```json
{
  "category_id": 2,
  "category_name": "Sofas",
  "total_orders": 6,
  "total_quantity_sold": "18",
  "total_sales": "700000.00"
}
```

## Analytics

Date-based analytics require `from` and `to` as `YYYY-MM-DD`. Inventory analytics has no date filter.

Response `400`: `Both from and to dates are required`, `Invalid date format. Use YYYY-MM-DD`, `Invalid date`, or `From date cannot be greater than to date`.

### Summary

`GET /api/admin/analytics/summary?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Analytics summary fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "summary": {
    "total_orders": 10,
    "successful_orders": 8,
    "cancelled_orders": 2,
    "total_revenue": "250000.00",
    "total_items_sold": "20",
    "average_order_value": "31250.00"
  }
}
```

Successful orders and revenue exclude cancelled orders.

### Sales trend

`GET /api/admin/analytics/sales?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Sales analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "total_records": 1,
  "sales": [
    {
      "sales_date": "2026-10-08",
      "total_orders": 3,
      "items_sold": "5",
      "product_sales": "120000.00",
      "discounts": "0.00",
      "shipping_revenue": "998.00",
      "total_revenue": "120998.00"
    }
  ]
}
```

### Revenue

`GET /api/admin/analytics/revenue?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Revenue analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "revenue": {
    "gross_sales": "120000.00",
    "total_discounts": "0.00",
    "shipping_revenue": "998.00",
    "cancelled_amount": "15000.00",
    "net_revenue": "120998.00"
  }
}
```

### Orders by status

`GET /api/admin/analytics/orders?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Orders analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "total_records": 1,
  "orders": [
    {
      "order_status": "PENDING",
      "total_orders": 4,
      "total_order_value": "90000.00"
    }
  ]
}
```

### Products

`GET /api/admin/analytics/products?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Products analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "products": {
    "total_products": 30,
    "active_products": 26,
    "inactive_products": 4,
    "total_units_sold": "20",
    "total_product_sales": "120000.00"
  }
}
```

### Best selling products

`GET /api/admin/analytics/best-selling-products?from=2026-10-01&to=2026-10-08`

Top 10 products with units sold greater than `0`.

```json
{
  "success": true,
  "message": "Best selling products analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "total_records": 1,
  "products": [
    {
      "product_id": 1,
      "product_name": "Oak Sofa",
      "main_image": "/uploads/products/sofa.jpg",
      "brand": "Woodline",
      "category_name": "Sofas",
      "units_sold": "8",
      "total_sales": "300000.00",
      "total_orders": 3
    }
  ]
}
```

### Categories

`GET /api/admin/analytics/categories?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Categories analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "total_records": 1,
  "categories": [
    {
      "category_id": 2,
      "category_name": "Sofas",
      "total_orders": 3,
      "units_sold": "8",
      "total_sales": "300000.00"
    }
  ]
}
```

### Customers

`GET /api/admin/analytics/customers?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Customers analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "customers": {
    "customers_with_orders": 6,
    "active_buyers": 5,
    "repeat_customers": 2,
    "average_customer_order_value": "25000.00",
    "customer_revenue": "120000.00"
  }
}
```

### Payments

`GET /api/admin/analytics/payments?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Payments analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "total_records": 1,
  "payments": [
    {
      "payment_method": "COD",
      "payment_status": "PENDING",
      "total_orders": 4,
      "total_amount": "90000.00"
    }
  ]
}
```

### Inventory

`GET /api/admin/analytics/inventory`

No date query.

```json
{
  "success": true,
  "message": "Inventory analytics fetched successfully",
  "inventory": {
    "total_variants": 20,
    "total_stock_quantity": "140",
    "available_variants": "12",
    "low_stock_variants": "3",
    "sold_out_variants": "2",
    "inactive_variants": "3"
  }
}
```

Available means active stock greater than `5`. Low stock means active stock from `1` to `5`.

### Best selling categories

`GET /api/admin/analytics/best-selling-categories?from=2026-10-01&to=2026-10-08`

```json
{
  "success": true,
  "message": "Best selling categories analytics fetched successfully",
  "date_range": { "from": "2026-10-01", "to": "2026-10-08" },
  "total_records": 1,
  "categories": [
    {
      "category_id": 2,
      "category_name": "Sofas",
      "units_sold": "8",
      "total_sales": "300000.00",
      "total_orders": 3
    }
  ]
}
```

## Notifications

Admin notification queries read the `notifications` table without a customer filter.

```json
{
  "id": 5,
  "type": "NEW_ORDER",
  "title": "New order",
  "message": "A new order was placed",
  "reference_type": "ORDER",
  "reference_id": 44,
  "is_read": 0,
  "created_at": "2026-10-08T04:00:00.000Z"
}
```

### Get all

`GET /api/admin/notifications`

```json
{
  "success": true,
  "message": "Notifications fetched successfully",
  "notifications": []
}
```

### Get unread

`GET /api/admin/notifications/unread`

```json
{
  "success": true,
  "message": "Unread notifications fetched successfully",
  "notifications": []
}
```

### Get unread count

`GET /api/admin/notifications/unread-count`

```json
{
  "success": true,
  "unread_count": 2
}
```

### Get one

`GET /api/admin/notifications/:id`

```json
{
  "success": true,
  "message": "Notification fetched successfully",
  "notification": {}
}
```

Response `400`: `Invalid notification ID`.

Response `404`: `Notification not found`.

### Mark one as read

`PATCH /api/admin/notifications/:id/read`

Request body: none.

```json
{
  "success": true,
  "message": "Notification marked as read successfully"
}
```

If it is already read:

```json
{
  "success": true,
  "message": "Notification is already marked as read"
}
```

### Mark all as read

`PATCH /api/admin/notifications/read-all`

Request body: none.

```json
{
  "success": true,
  "message": "All notifications marked as read successfully",
  "updated_count": 4
}
```

### Delete one

`DELETE /api/admin/notifications/:id`

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

## Customization requests

Admin list item:

```json
{
  "id": 9,
  "customer_id": 8,
  "customer_name": "Asha",
  "customer_email": "asha@example.com",
  "customer_phone": "9876543210",
  "request_type": "EXISTING_PRODUCT",
  "product_id": 1,
  "product_name": "Oak Sofa",
  "product_image": "/uploads/products/sofa.jpg",
  "customer_requirement": "Please make this sofa in teak",
  "customer_image": "/uploads/customization/ref.jpg",
  "admin_reply": null,
  "additional_cost": "0.00",
  "status": "PENDING",
  "created_at": "2026-10-08T04:00:00.000Z",
  "updated_at": "2026-10-08T04:00:00.000Z"
}
```

The single-request response also includes `customer_status` and `product_price`. The status-filter list includes `customer_name` and `customer_email`, and does not include `customer_phone` or `product_image`.

Allowed statuses: `PENDING`, `UNDER_REVIEW`, `ADMIN_REPLIED`, `CUSTOMER_ACCEPTED`, `READY_TO_ORDER`, `ORDERED`, `REJECTED`.

### Get all requests

`GET /api/admin/customization-requests`

```json
{
  "success": true,
  "message": "Customization requests fetched successfully",
  "requests": []
}
```

### Get requests by status

`GET /api/admin/customization-requests/status/:status`

Example: `GET /api/admin/customization-requests/status/PENDING`

```json
{
  "success": true,
  "message": "Customization requests fetched successfully",
  "status": "PENDING",
  "requests": []
}
```

Response `400`: `Invalid customization request status`.

### Get one request

`GET /api/admin/customization-requests/:id`

```json
{
  "success": true,
  "message": "Customization request fetched successfully",
  "request": {}
}
```

### Change status

`PATCH /api/admin/customization-requests/:id/status`

```json
{
  "status": "UNDER_REVIEW"
}
```

Admin transitions that succeed:

| Current status | New status | Success message |
| --- | --- | --- |
| `PENDING` | `UNDER_REVIEW` | `Request moved to UNDER_REVIEW` |
| `UNDER_REVIEW` | `REJECTED` | `Customization request rejected` |

Any other change returns `400` with `Cannot change status from <current> to <new>`.

Response `200`:

```json
{
  "success": true,
  "message": "Request moved to UNDER_REVIEW",
  "status": "UNDER_REVIEW"
}
```

### Reply to a request

`PUT /api/admin/customization-requests/:id/reply`

Allowed only when the current status is `UNDER_REVIEW`. Sending the reply moves the request to `ADMIN_REPLIED`.

```json
{
  "admin_reply": "We can make this in teak. Extra cost is listed below.",
  "additional_cost": 2500
}
```

`admin_reply` is required. `additional_cost` is optional and defaults to `0`. It must be a number `0` or greater.

Response `200`:

```json
{
  "success": true,
  "message": "Admin reply sent successfully",
  "status": "ADMIN_REPLIED",
  "additional_cost": 2500
}
```

### Delete a request

`DELETE /api/admin/customization-requests/:id`

Request body: none. A request with status `ORDERED` cannot be deleted.

Response `200`:

```json
{
  "success": true,
  "message": "Customization request deleted successfully"
}
```

## Custom requirements

These are the public custom-furniture submissions, read by admin.

Requirement object:

```json
{
  "id": 15,
  "customer_id": null,
  "name": "Ravi",
  "email": "ravi@example.com",
  "phone": "9876543210",
  "address": "12 Lake Road",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "pincode": "600001",
  "alternative_address": null,
  "requirement": "Need a 6 seat teak dining table",
  "reference_image": "/uploads/custom-requirements/table.jpg",
  "created_at": "2026-10-08T04:00:00.000Z",
  "updated_at": "2026-10-08T04:00:00.000Z"
}
```

### Get all custom requirements

`GET /api/admin/custom-requirements`

Request body: none.

```json
{
  "success": true,
  "message": "Custom requirements fetched successfully",
  "data": []
}
```

### Get one custom requirement

`GET /api/admin/custom-requirements/:id`

```json
{
  "success": true,
  "message": "Custom requirement fetched successfully",
  "data": {}
}
```

Response `400`: `Invalid requirement ID`.

Response `404`: `Custom requirement not found`.

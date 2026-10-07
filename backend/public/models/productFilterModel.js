const { pool } = require("../../config/database");

// ======================================================
// SEARCH + FILTER + PAGINATION
// ======================================================

const getFilteredProducts = async ({
  search,
  categoryId,
  material,
  woodType,
  minPrice,
  maxPrice,
  sort,
  page,
  limit,
}) => {
  const conditions = [
    "p.status = 'ACTIVE'",
    "c.status = 'ACTIVE'",
  ];

  const params = [];

  // ====================================================
  // SEARCH
  // ====================================================

  if (search) {
    conditions.push(`
      (
        p.name LIKE ?
        OR p.brand LIKE ?
        OR p.short_description LIKE ?
        OR p.description LIKE ?
      )
    `);

    const searchValue = `%${search}%`;

    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue
    );
  }

  // ====================================================
  // CATEGORY
  // ====================================================

  if (categoryId !== undefined) {
    conditions.push("p.category_id = ?");
    params.push(categoryId);
  }

  // ====================================================
  // MATERIAL
  // ====================================================

  if (material) {
    conditions.push("p.material = ?");
    params.push(material);
  }

  // ====================================================
  // WOOD TYPE
  // ====================================================

  if (woodType) {
    conditions.push("p.wood_type = ?");
    params.push(woodType);
  }

  // ====================================================
  // MIN PRICE
  // ====================================================

  if (minPrice !== undefined) {
    conditions.push("p.selling_price >= ?");
    params.push(minPrice);
  }

  // ====================================================
  // MAX PRICE
  // ====================================================

  if (maxPrice !== undefined) {
    conditions.push("p.selling_price <= ?");
    params.push(maxPrice);
  }

  // ====================================================
  // WHERE
  // ====================================================

  const whereClause = `
    WHERE ${conditions.join(" AND ")}
  `;

  // ====================================================
  // SORT
  // ====================================================

  let orderBy = "p.id DESC";

  switch (sort) {
    case "price_low":
      orderBy = "p.selling_price ASC";
      break;

    case "price_high":
      orderBy = "p.selling_price DESC";
      break;

    case "name_asc":
      orderBy = "p.name ASC";
      break;

    case "name_desc":
      orderBy = "p.name DESC";
      break;

    case "newest":
      orderBy = "p.id DESC";
      break;

    case "oldest":
      orderBy = "p.id ASC";
      break;

    default:
      orderBy = "p.id DESC";
  }

  // ====================================================
  // TOTAL PRODUCTS
  // ====================================================

  const [countRows] = await pool.execute(
    `
      SELECT COUNT(*) AS total_products

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      ${whereClause}
    `,
    params
  );

  const totalProducts = Number(
    countRows[0]?.total_products || 0
  );

  // ====================================================
  // PAGINATION
  // ====================================================

  const offset = (page - 1) * limit;

  // LIMIT/OFFSET are validated numbers from controller.
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.category_id,
        c.name AS category_name,

        p.name,
        p.brand,
        p.main_image,
        p.short_description,

        p.mrp,
        p.selling_price,

        p.material,
        p.wood_type,

        p.length,
        p.width,
        p.height,
        p.weight,

        p.seating_capacity,
        p.assembly_required,
        p.delivery_days,

        COALESCE(
          ROUND(
            (
              SELECT AVG(pr.rating)
              FROM product_reviews pr
              WHERE pr.product_id = p.id
                AND pr.status = 'APPROVED'
            ),
            1
          ),
          0
        ) AS average_rating,

        (
          SELECT COUNT(*)
          FROM product_reviews pr
          WHERE pr.product_id = p.id
            AND pr.status = 'APPROVED'
        ) AS total_reviews

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      ${whereClause}

      ORDER BY ${orderBy}

      LIMIT ${limit}
      OFFSET ${offset}
    `,
    params
  );

  return {
    products: rows,
    totalProducts,
  };
};

module.exports = {
  getFilteredProducts,
};
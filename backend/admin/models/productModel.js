const { pool } = require("../../config/database");

// CREATE PRODUCT
const createProduct = async (productData) => {
  const {
    category_id,
    name,
    brand,
    main_image,
    short_description,
    description,
    mrp,
    selling_price,
    material,
    wood_type,
    length,
    width,
    height,
    weight,
    seating_capacity,
    assembly_required,
  } = productData;

  const [result] = await pool.execute(
    `INSERT INTO products (
      category_id,
      name,
      brand,
      main_image,
      short_description,
      description,
      mrp,
      selling_price,
      material,
      wood_type,
      length,
      width,
      height,
      weight,
      seating_capacity,
      assembly_required
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      name,
      brand || null,
      main_image || null,
      short_description || null,
      description || null,
      mrp,
      selling_price,
      material || null,
      wood_type || null,
      length || null,
      width || null,
      height || null,
      weight || null,
      seating_capacity || null,
      assembly_required || "NO",
    ]
  );

  return result.insertId;
};


// GET ALL PRODUCTS
const getAllProducts = async () => {
  const [rows] = await pool.execute(
    `SELECT
      p.id,
      p.category_id,
      c.name AS category_name,
      p.name,
      p.brand,
      p.main_image,
      p.short_description,
      p.description,
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
      p.status,
      p.created_at,
      p.updated_at
    FROM products p
    INNER JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.id DESC`
  );

  return rows;
};


// GET PRODUCT BY ID
const getProductById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      p.id,
      p.category_id,
      c.name AS category_name,
      p.name,
      p.brand,
      p.main_image,
      p.short_description,
      p.description,
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
      p.status,
      p.created_at,
      p.updated_at
    FROM products p
    INNER JOIN categories c
      ON p.category_id = c.id
    WHERE p.id = ?`,
    [id]
  );

  return rows[0];
};


// UPDATE PRODUCT
const updateProduct = async (id, productData) => {
  const {
    category_id,
    name,
    brand,
    main_image,
    short_description,
    description,
    mrp,
    selling_price,
    material,
    wood_type,
    length,
    width,
    height,
    weight,
    seating_capacity,
    assembly_required,
  } = productData;

  let query = `
    UPDATE products
    SET
      category_id = ?,
      name = ?,
      brand = ?,
      short_description = ?,
      description = ?,
      mrp = ?,
      selling_price = ?,
      material = ?,
      wood_type = ?,
      length = ?,
      width = ?,
      height = ?,
      weight = ?,
      seating_capacity = ?,
      assembly_required = ?
  `;

  const values = [
    category_id,
    name,
    brand || null,
    short_description || null,
    description || null,
    mrp,
    selling_price,
    material || null,
    wood_type || null,
    length || null,
    width || null,
    height || null,
    weight || null,
    seating_capacity || null,
    assembly_required || "NO",
  ];

  // Replace main image only if a new image was uploaded
  if (main_image) {
    query += `, main_image = ?`;
    values.push(main_image);
  }

  query += ` WHERE id = ?`;

  values.push(id);

  const [result] = await pool.execute(query, values);

  return result.affectedRows;
};


// UPDATE PRODUCT STATUS
const updateProductStatus = async (id, status) => {
  const [result] = await pool.execute(
    `UPDATE products
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows;
};


// DELETE PRODUCT
const deleteProduct = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM products
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
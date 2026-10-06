const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");

const seedAdmin = async () => {
  try {
    const name = "Super Admin";
    const email = "admin@furniture.com";
    const password = "Admin@123";

    const [existingAdmin] = await pool.execute(
      "SELECT id FROM admins WHERE email = ?",
      [email]
    );

    if (existingAdmin.length > 0) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      `INSERT INTO admins (name, email, password, status)
       VALUES (?, ?, ?, 'ACTIVE')`,
      [name, email, hashedPassword]
    );

    console.log("Admin created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
  } finally {
    await pool.end();
  }
};

seedAdmin();
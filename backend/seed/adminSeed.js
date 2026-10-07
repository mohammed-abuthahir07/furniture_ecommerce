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


// 1. Customer Authentication       ✅
// 2. Customer Profile Management   ← NEXT
// 3. Comments
// 4. Public Products
// 5. Wishlist
// 6. Cart
// 7. Customization Requests
// 8. Ratings & Reviews
// 9. Checkout
// 10. Payments
// 11. Orders & Tracking
// 12. Customer Notifications
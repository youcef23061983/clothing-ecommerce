const pool = require("../libs/db.js");

const saveOrderToDatabase = async (orderData) => {
  let client; // ✅ Declare client at the top

  const {
    fullName,
    address,
    city,
    postalCode,
    country,
    payment,
    amount,
    tbluser_id,
    phone,
    subtotal,
    tax,
    shipping,
    total,
    sellingProduct,
  } = orderData;

  try {
    client = await pool.connect(); // ✅ no `const`

    // ✅ Start a transaction
    await client.query("BEGIN");

    // 1. Insert into orders
    const orderRes = await client.query(
      `INSERT INTO orders (
        full_name, address, city, postal_code, country,
        payment, tbluser_id, subtotal, tax, total,amount,shipping,phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)
      RETURNING id`,
      [
        fullName,
        address,
        city,
        postalCode,
        country,
        payment,
        tbluser_id,
        subtotal,
        tax,
        total,
        amount,
        shipping,
        phone,
      ]
    );

    const orderId = orderRes.rows[0].id;

    // 2. Insert into order_items
    for (const item of sellingProduct) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, amount, unit_price, total_price
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.id,
          item.product_name,
          item.amount,
          item.unitPrice,
          item.totalPrice,
        ]
      );
    }

    // ✅ Commit if all successful
    await client.query("COMMIT");

    return { success: true };
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release(); // ✅ safe now
  }
};
module.exports = saveOrderToDatabase;

require("dotenv").config();
const pool = require("../libs/db.js");

// const getProducts = async (req, res) => {
//   try {
//     const products = await pool.query("select * from products");
//     res.json(products.rows);
//     console.log("products have been rendered");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// *****************************second appraoch with input back filter and front filter the bar
// const getProducts = async (req, res) => {
//   try {
//     const { search } = req.query;

//     let query = "SELECT * FROM products";
//     const values = [];

//     if (search) {
//       query += `
//   WHERE product_name::text ILIKE $1
//      OR description::text  ILIKE $1
//      OR type::text         ILIKE $1
// `;
//       values.push(`%${search}%`);
//     }

//     const products = await pool.query(query, values);
//     res.json(products.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Failed to fetch products." });
//   }
// };

// *****************************third appraoch with input back filter and backend filter the bar
const getProducts = async (req, res) => {
  try {
    const {
      search,
      type,
      price,
      rating,
      on_sale,
      best_seller,
      new_arrival,
      sortOption,
    } = req.query;

    let query = "SELECT * FROM products";

    const conditions = [];
    const values = [];

    // SEARCH
    if (search) {
      values.push(`%${search}%`);

      conditions.push(`
        (
          product_name::text ILIKE $${values.length}
          OR description::text ILIKE $${values.length}
          OR type::text ILIKE $${values.length}
        )
      `);
    }

    // TYPE
    if (type && type !== "all") {
      values.push(type);
      conditions.push(`type::text = $${values.length}`);
    }

    // PRICE
    if (price && Number(price) > 0) {
      values.push(Number(price));
      conditions.push(`price >= $${values.length}`);
    }

    // RATING
    if (rating && Number(rating) > 1) {
      values.push(Number(rating));
      conditions.push(`rating >= $${values.length}`);
    }

    if (on_sale === "true") {
      conditions.push(`on_sale = true`);
    }

    if (best_seller === "true") {
      conditions.push(`best_seller = true`);
    }

    if (new_arrival === "true") {
      conditions.push(`new_arrival = true`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sortOption === "priceLowToHigh") {
      query += ` ORDER BY price ASC`;
    } else if (sortOption === "priceHighToLow") {
      query += ` ORDER BY price DESC`;
    }

    // Products
    const productsResult = await pool.query(query, values);

    // Global price range
    const priceResult = await pool.query(`
      SELECT
        MIN(price) AS min_price,
        MAX(price) AS max_price
      FROM products
    `);

    res.json({
      products: productsResult.rows,
      priceRange: priceResult.rows[0],
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      message: "Failed to fetch products.",
    });
  }
};
// create a products:
const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      description,
      type,
      price,
      new_price,
      sizes,
      images,
      new_arrival,
      on_sale,
      best_seller,
      rating,
      preview,
    } = req.body;
    const newProduct = await pool.query(
      "insert into products (product_name,description,type,price,new_price,sizes,images,new_arrival,on_sale,best_seller,rating,preview) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",
      [
        product_name,
        description,
        type,
        price,
        new_price,
        sizes,
        images,
        new_arrival,
        on_sale,
        best_seller,
        rating,
        preview,
      ],
    );
    res.json(newProduct.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

// get a todo:
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("select * from products where id=$1", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};
// update a todo:
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { description, type, price, new_price } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
       SET description = $1, type = $2, price = $3, new_price = $4
       WHERE id = $5
       RETURNING *`,
      [description, type, price, new_price, id],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `Product with id ${id} not found.` });
    }

    res.json({
      message: `Product with id ${id} updated successfully.`,
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete a todo:
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("delete from products where id=$1", [id]);
    res.json(`it is deleted successfully, todo id: ${id} `);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

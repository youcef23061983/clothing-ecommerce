require("dotenv").config();
const pool = require("../libs/db.js");

const getProducts = async (req, res) => {
  try {
    const products = await pool.query("select * from products");
    res.json(products.rows);
    console.log("products have been rendered");
  } catch (error) {
    console.log(error.message);
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
      ]
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
      [description, type, price, new_price, id]
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

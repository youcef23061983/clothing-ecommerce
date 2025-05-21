const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsControllers.js");
const router = express.Router();

// /get all products:

router.get("/", getProducts);

// create a products:
router.post("/", createProduct);

// get a todo:
router.get("/:id", getProduct);
// update a todo:
router.patch("/:id", updateProduct);

// delete a todo:
router.delete("/:id", deleteProduct);

module.exports = router;

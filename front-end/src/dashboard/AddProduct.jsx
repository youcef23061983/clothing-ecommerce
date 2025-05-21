import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    type: "",
    price: "",
    sizes: [],
    new_price: "",
    images: [],
    new_arrival: false,
    on_sale: false,
    best_seller: false,
    rating: 1,
    preview: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        alert("Product added successfully!");
        navigate("/");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Box m="20px">
      <TextField
        label="Product Name"
        fullWidth
        margin="dense"
        name="product_name"
        value={product.product_name}
        onChange={handleChange}
      />
      <TextField
        label="Description"
        fullWidth
        margin="dense"
        name="description"
        value={product.description}
        onChange={handleChange}
      />
      <FormControl fullWidth margin="dense">
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          name="type"
          value={product.type}
          onChange={handleChange}
        >
          <MenuItem value="jacket">jacket</MenuItem>
          <MenuItem value="jeans">jeans</MenuItem>
          <MenuItem value="shirt">shirt</MenuItem>
          <MenuItem value="shoes">shoes</MenuItem>
          <MenuItem value="sneaker">sneaker</MenuItem>
          <MenuItem value="sweatshirt">sweatshirt</MenuItem>
          <MenuItem value="trousers">trousers</MenuItem>
          <MenuItem value="tshirt">tshirt</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Price"
        type="number"
        fullWidth
        margin="dense"
        name="price"
        value={product.price}
        onChange={handleChange}
      />
      <TextField
        label="New Price (Optional)"
        type="number"
        fullWidth
        margin="dense"
        name="new_price"
        value={product.new_price}
        onChange={handleChange}
      />
      <TextField
        label="Images (URLs)"
        fullWidth
        margin="dense"
        name="images"
        value={product.images.join(", ")}
        onChange={(e) =>
          setProduct({
            ...product,
            images: e.target.value.split(",").map((img) => img.trim()),
          })
        }
      />
      <FormControl fullWidth margin="dense">
        <InputLabel>Sizes</InputLabel>
        <Select
          label="Sizes"
          multiple
          name="sizes"
          value={product.sizes}
          onChange={(e) =>
            setProduct({
              ...product,
              sizes: e.target.value,
            })
          }
        >
          <MenuItem value="s">S</MenuItem>
          <MenuItem value="m">M</MenuItem>
          <MenuItem value="l">L</MenuItem>
          <MenuItem value="xl">XL</MenuItem>
        </Select>
      </FormControl>
      <FormControl margin="dense">
        <label>
          New Arrival
          <input
            type="checkbox"
            name="new_arrival"
            checked={product.new_arrival}
            onChange={handleCheckboxChange}
          />
        </label>
      </FormControl>
      <FormControl margin="dense">
        <label>
          On Sale
          <input
            type="checkbox"
            name="on_sale"
            checked={product.on_sale}
            onChange={handleCheckboxChange}
          />
        </label>
      </FormControl>
      <FormControl margin="dense">
        <label>
          Best Seller
          <input
            type="checkbox"
            name="best_seller"
            checked={product.best_seller}
            onChange={handleCheckboxChange}
          />
        </label>
      </FormControl>
      <TextField
        label="Rating"
        type="number"
        fullWidth
        margin="dense"
        name="rating"
        value={product.rating}
        onChange={handleChange}
      />
      <TextField
        label="Preview"
        type="number"
        fullWidth
        margin="dense"
        name="preview"
        value={product.preview}
        onChange={handleChange}
      />

      <Box display="flex" justifyContent="space-between" marginTop="20px">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/dashboard/productsdashboard")}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default AddProduct;

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
    productName: "",
    slug: "",
    type: "",
    price: "",
    size: [],
    newPrice: "",
    images: [],
    newArrival: false,
    onSale: false,
    bestSeller: false,
    rating: 1,
    preview: 0,
    amount: 1,
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
        name="productName"
        value={product.productName}
        onChange={handleChange}
      />
      <TextField
        label="Description"
        fullWidth
        margin="dense"
        name="slug"
        value={product.slug}
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
          <MenuItem value="shirt">jeans</MenuItem>
          <MenuItem value="pants">shirt</MenuItem>
          <MenuItem value="shoes">shoes</MenuItem>
          <MenuItem value="accessories">sneaker</MenuItem>
          <MenuItem value="accessories">sweatshirt</MenuItem>
          <MenuItem value="accessories">trousers</MenuItem>
          <MenuItem value="accessories">tshirt</MenuItem>
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
        name="newPrice"
        value={product.newPrice}
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
        <InputLabel>Size</InputLabel>
        <Select
          label="Size"
          multiple
          name="size"
          value={product.size}
          onChange={(e) =>
            setProduct({
              ...product,
              size: e.target.value,
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
            name="newArrival"
            checked={product.newArrival}
            onChange={handleCheckboxChange}
          />
        </label>
      </FormControl>
      <FormControl margin="dense">
        <label>
          On Sale
          <input
            type="checkbox"
            name="onSale"
            checked={product.onSale}
            onChange={handleCheckboxChange}
          />
        </label>
      </FormControl>
      <FormControl margin="dense">
        <label>
          Best Seller
          <input
            type="checkbox"
            name="bestSeller"
            checked={product.bestSeller}
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
      <TextField
        label="Amount"
        type="number"
        fullWidth
        margin="dense"
        name="amount"
        value={product.amount}
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

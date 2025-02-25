import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import UseFetch from "../data managment/UseFetch";

const ProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;
  const key1 = "products";
  const { data } = UseFetch(url, key1);

  useEffect(() => {
    if (data) {
      setProducts(
        data.map(
          ({ id, type, slug, price, newPrice, rating, preview, images }) => ({
            id,
            type,
            slug,
            price,
            newPrice,
            rating,
            preview,
            image: images?.[0],
          })
        )
      );
    }
  }, [data]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      } else {
        console.error("Failed to delete the product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProduct(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products/${
          selectedProduct.id
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedProduct),
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === selectedProduct.id ? selectedProduct : product
          )
        );
        handleCloseEdit();
      } else {
        console.error("Failed to update the product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "slug", headerName: "Description", flex: 2 },
    { field: "price", headerName: "Old Price", flex: 1 },
    { field: "newPrice", headerName: "New Price", flex: 1 },
    { field: "rating", headerName: "Rating", flex: 1 },
    { field: "preview", headerName: "Preview", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: ({ row }) => (
        <img
          src={row.image}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <IconButton color="success" onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{ "& .MuiDataGrid-root": { border: "none" } }}
      >
        <DataGrid checkboxSelection rows={products || []} columns={columns} />
      </Box>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Type"
            fullWidth
            margin="dense"
            value={selectedProduct?.type || ""}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, type: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={selectedProduct?.slug || ""}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, slug: e.target.value })
            }
          />
          <TextField
            label="Old Price"
            type="number"
            fullWidth
            margin="dense"
            value={selectedProduct?.price || ""}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, price: e.target.value })
            }
          />
          <TextField
            label="New Price"
            type="number"
            fullWidth
            margin="dense"
            value={selectedProduct?.newPrice || ""}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                newPrice: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Button */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/addProduct")}
        >
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default ProductsDashboard;

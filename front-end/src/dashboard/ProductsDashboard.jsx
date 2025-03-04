import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${url}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      return id;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [key1] });
    },
    onMutate: async (id) => {
      // Ensures no new fetch completes while we are making an optimistic update:When you call await queryClient.cancelQueries({ queryKey: [key1] }), it pauses any ongoing fetching for that query key until the mutation is complete..

      await queryClient.cancelQueries({ queryKey: [key1] });

      const previousProducts = queryClient.getQueryData([key1]);
      queryClient.setQueryData([key1], (old) =>
        old?.filter((product) => product.id !== id)
      );

      return { previousProducts };
    },
    onError: (err, id, context) => {
      console.error("Delete failed:", err);
      queryClient.setQueryData([key1], context.previousProducts);
    },
  });

  // EDIT MUTATION
  const editMutation = useMutation({
    mutationFn: async (updatedProduct) => {
      const response = await fetch(`${url}/${updatedProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error("Failed to update");
      return updatedProduct;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [key1] });
    },
    onMutate: async (updatedProduct) => {
      // Ensures no new fetch completes while we are making an optimistic update:When you call await queryClient.cancelQueries({ queryKey: [key1] }), it pauses any ongoing fetching for that query key until the mutation is complete..

      await queryClient.cancelQueries({ queryKey: [key1] });

      const previousProducts = queryClient.getQueryData([key1]);

      queryClient.setQueryData([key1], (old) =>
        old?.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );

      return { previousProducts };
    },
    onError: (err, updatedProduct, context) => {
      console.error("Update failed:", err);
      queryClient.setQueryData([key1], context.previousProducts);
    },
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) deleteMutation.mutate(id);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProduct(null);
  };

  const handleSaveEdit = () => {
    if (selectedProduct) {
      editMutation.mutate(selectedProduct, { onSuccess: handleCloseEdit });
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

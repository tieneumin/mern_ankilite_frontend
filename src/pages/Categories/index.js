import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../utils/api_categories";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Cancel, Delete, Edit, Send } from "@mui/icons-material";

import Navbar from "../../components/Navbar";

export default function Categories() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { role, token } = {} } = cookies;

  const [name, setName] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (role !== "admin") {
      enqueueSnackbar("Access forbidden.", { variant: "error" });
      navigate("/");
    }
  });

  let mutaType = "";

  const mutationAddCategory = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      enqueueSnackbar("Category added.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleAddCategory = () => {
    if (name === "") {
      enqueueSnackbar("Category name is required.", { variant: "error" });
    } else {
      mutationAddCategory.mutate({ name, token });
    }
  };

  const mutationUpdateCategory = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      enqueueSnackbar("Category updated.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpenEditModal(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleUpdateCategory = () => {
    if (editName === "") {
      enqueueSnackbar("Category name is required.", { variant: "error" });
    } else {
      mutationUpdateCategory.mutate({ _id: editId, name: editName, token });
    }
  };

  const mutationDeleteCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      enqueueSnackbar("Category deleted.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleDeleteCategory = (_id) => {
    if (window.confirm("Delete category?"))
      mutationDeleteCategory.mutate({ _id, token });
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Categories
        </Typography>
        <Box display="flex">
          <TextField
            fullWidth
            size="small"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddCategory}>
            <Add />
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small" style={{ fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell
                  size="small"
                  align="right"
                  style={{ fontWeight: "bold" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell size="small" style={{ wordBreak: "break-word" }}>
                      {c.name}
                    </TableCell>
                    <TableCell size="small">
                      <Box display="flex" justifyContent="end">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => {
                            setOpenEditModal(true);
                            setEditId(c._id);
                            setEditName(c.name);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteCategory(c._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No categories exist.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent sx={{ pb: 0 }}>
            <TextField
              size="small"
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <IconButton color="error" onClick={() => setOpenEditModal(false)}>
              <Cancel />
            </IconButton>
            <IconButton color="primary" onClick={handleUpdateCategory}>
              <Send />
            </IconButton>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";
import { getDeck, addDeck, updateDeck } from "../../utils/api_decks";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import NotFound from "../NotFound";

export default function DeckForm({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id, role, token } = {} } = cookies;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const {
    data: deck,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(id),
    enabled: type === "edit" ? true : false,
  });

  useEffect(() => {
    if (!cookies.session) {
      enqueueSnackbar(`Log in to ${type} decks.`);
      navigate("/login");
    }
    if (deck) {
      if (type === "edit" && !(_id === deck.creator || role === "admin")) {
        enqueueSnackbar("Access forbidden.", {
          variant: "error",
        });
        navigate("/decks");
      }
      setTitle(deck.title);
      setDescription(deck.description);
      setCategory(deck.category._id);
    }
  }, [deck]);

  const mutationSaveDeck = useMutation({
    mutationFn: type === "add" ? addDeck : updateDeck,
    onSuccess: () => {
      enqueueSnackbar(`Deck ${type === "add" ? "added" : "updated"}.`, {
        variant: "success",
      });
      navigate("/decks");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const handleSaveDeck = () => {
    if (title === "" || category === "") {
      enqueueSnackbar("Title and category are required.", {
        variant: "error",
      });
    } else {
      mutationSaveDeck.mutate({
        _id: type === "edit" ? id : null,
        title,
        description,
        category,
        token,
      });
    }
  };

  if (isLoading) {
    return (
      <Box align="center">
        Loading...
        <LoadingButton loading></LoadingButton>
      </Box>
    );
  }

  if (isError) {
    return <NotFound type="deck" />;
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold">
              {type === "add" ? "Create a new deck" : "Edit an existing deck"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle">Title</Typography>
            <Typography variant="subtitle" color="red">
              *
            </Typography>
            <TextField
              autoFocus={type === "add"}
              fullWidth
              size="small"
              sx={{ mt: 0.5 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle">Description</Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              sx={{ mt: 0.5 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle">Category</Typography>
            <Typography variant="subtitle" color="red">
              *
            </Typography>
            <Select
              fullWidth
              size="small"
              sx={{ mt: 0.5 }}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              {categories.map((c) => {
                return (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              sx={{ textTransform: "capitalize", mt: 0.5 }}
              onClick={handleSaveDeck}
            >
              {type === "add" ? "Add Deck" : "Update Deck"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

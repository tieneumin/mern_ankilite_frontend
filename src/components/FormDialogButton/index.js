import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";
import { getDeck, addDeck, updateDeck } from "../../utils/api_decks";
import { getCard, addCard, updateCard } from "../../utils/api_cards";
import { uploadImage } from "../../utils/api_images";
import { url } from "../../utils/data";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AddCircle, Clear, Edit, Upload } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import NotFound from "../NotFound";

export default function FormDialogButton({ operation, type, id }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id, role, token } = {} } = cookies;

  const [formDialog, setFormDialog] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [fTitle, setFTitle] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fImage, setFImage] = useState("");
  const [bTitle, setBTitle] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bImage, setBImage] = useState("");

  const [category, setCategory] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const {
    data: deck, // no `=[]` to avoid controlled -> uncontrolled inputs
    isLoading: isDeckLoading,
    isError: isDeckError,
  } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(id),
    enabled: operation === "edit" && type === "deck" ? true : false, // does not query when operation === "add"
  });

  const {
    data: card,
    isLoading: isCardLoading,
    isError: isCardError,
  } = useQuery({
    queryKey: ["card", id],
    queryFn: () => getCard(id),
    enabled: operation === "edit" && type === "card" ? true : false,
  });

  useEffect(() => {
    if (!cookies.session) {
      enqueueSnackbar(
        `Log in to ${operation} ${type === "deck" ? "decks" : "cards"}.`
      );
      navigate("/login");
    }
    if (deck) {
      if (
        operation === "edit" &&
        !(_id === deck.creator._id || role === "admin")
      ) {
        enqueueSnackbar("Access forbidden.", { variant: "error" });
        navigate("/decks");
      }
      setTitle(deck.title);
      setDescription(deck.description);
      setCategory(deck.category._id);
    }
    if (card) {
      if (operation === "edit" && !(_id === card.creator || role === "admin")) {
        enqueueSnackbar("Access forbidden.", { variant: "error" });
        navigate("/cards");
      }
      setFTitle(card.fTitle);
      setFDesc(card.fDesc);
      setFImage(card.fImage);
      setBTitle(card.bTitle);
      setBDesc(card.bDesc);
      setBImage(card.bImage);
      setCategory(card.category);
    }
  }, [deck, card]);

  const mutationUploadFImage = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setFImage(data.image_url);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleUploadFImage = (e) => {
    mutationUploadFImage.mutate(e.target.files[0]);
  };

  const mutationUploadBImage = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setBImage(data.image_url);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleUploadBImage = (e) => {
    mutationUploadBImage.mutate(e.target.files[0]);
  };

  const mutationSaveDeck = useMutation({
    mutationFn: operation === "add" ? addDeck : updateDeck,
    onSuccess: () => {
      enqueueSnackbar(`Deck ${operation === "add" ? "added" : "updated"}.`, {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["deck"] });
      setFormDialog(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleSaveDeck = () => {
    if (title === "" || category === "") {
      enqueueSnackbar("Title and category are required.", { variant: "error" });
    } else {
      mutationSaveDeck.mutate({
        _id: operation === "edit" ? id : null,
        title,
        description,
        category,
        token,
      });
    }
  };

  const mutationSaveCard = useMutation({
    mutationFn: operation === "add" ? addCard : updateCard,
    onSuccess: () => {
      enqueueSnackbar(`Card ${operation === "add" ? "added" : "updated"}.`, {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card"] });
      setFormDialog(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleSaveCard = () => {
    if (fTitle === "" || bTitle === "" || category === "") {
      enqueueSnackbar("Front title, back title and category are required.", {
        variant: "error",
      });
    } else {
      mutationSaveCard.mutate({
        _id: operation === "edit" ? id : null,
        fTitle,
        fDesc,
        fImage,
        bTitle,
        bDesc,
        bImage,
        category,
        token,
      });
    }
  };

  if (isDeckLoading || isCardLoading) {
    return (
      <Box align="center">
        Loading...
        <LoadingButton loading></LoadingButton>
      </Box>
    );
  }

  if (isDeckError) {
    return <NotFound type="deck" />;
  }

  if (isCardError) {
    return <NotFound type="card" />;
  }

  return (
    <>
      <IconButton
        color="primary"
        size="small"
        onClick={() => {
          setFormDialog(true);
        }}
      >
        {operation === "add" ? <AddCircle /> : <Edit />}
      </IconButton>

      <Dialog
        open={formDialog}
        onClose={() => {
          setFormDialog(false);
        }}
      >
        <Card sx={{ py: 1, px: 2 }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight="bold">
                  {operation === "add"
                    ? `Create a new ${type}`
                    : `Edit an existing ${type}`}
                </Typography>
              </Grid>
              {type === "deck" ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle">Title</Typography>
                    <Typography variant="subtitle" color="red">
                      *
                    </Typography>
                    <TextField
                      autoFocus={operation === "add"}
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
                </>
              ) : (
                <>
                  <Grid item sm={6} xs={12}>
                    <Typography variant="subtitle">Front Title</Typography>
                    <Typography variant="subtitle" color="red">
                      *
                    </Typography>
                    <TextField
                      autoFocus={operation === "add"}
                      fullWidth
                      size="small"
                      sx={{ mt: 0.5 }}
                      value={fTitle}
                      onChange={(e) => setFTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Typography variant="subtitle">Back Title</Typography>
                    <Typography variant="subtitle" color="red">
                      *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mt: 0.5 }}
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle">
                      Front Description
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      sx={{ mt: 0.5 }}
                      value={fDesc}
                      onChange={(e) => setFDesc(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle">Back Description</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      sx={{ mt: 0.5 }}
                      value={bDesc}
                      onChange={(e) => setBDesc(e.target.value)}
                    />
                  </Grid>
                </>
              )}
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
              {type === "card" ? (
                <>
                  <Grid item sm={6} xs={12}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ gap: 3, mt: 0.5 }}
                    >
                      {fImage ? (
                        <>
                          <img
                            src={`${url}/${fImage}`}
                            height="128px"
                            width="128px"
                            alt="fImage"
                          />
                          <IconButton
                            color="error"
                            onClick={() => setFImage("")}
                          >
                            <Clear />
                          </IconButton>
                        </>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Upload />}
                          style={{ textTransform: "capitalize" }}
                          component="label"
                        >
                          <input
                            style={{ height: "0", width: "0" }}
                            type="file"
                            multiple={false}
                            onChange={handleUploadFImage}
                          />
                          Upload Front Image
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ gap: 3, mt: 0.5 }}
                    >
                      {bImage ? (
                        <>
                          <img
                            src={`${url}/${bImage}`}
                            height="128px"
                            width="128px"
                            alt="bImage"
                          />
                          <IconButton
                            color="error"
                            onClick={() => setBImage("")}
                          >
                            <Clear />
                          </IconButton>
                        </>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Upload />}
                          style={{ textTransform: "capitalize" }}
                          component="label"
                        >
                          <input
                            style={{ height: "0", width: "0" }}
                            type="file"
                            multiple={false}
                            onChange={handleUploadBImage}
                          />
                          Upload Back Image
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </>
              ) : null}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 0.5, textTransform: "capitalize" }}
                  onClick={type === "deck" ? handleSaveDeck : handleSaveCard}
                >
                  {operation === "add" ? `Add ${type}` : `Update ${type}`}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Dialog>
    </>
  );
}

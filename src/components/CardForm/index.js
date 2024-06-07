import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";
import { getCard, addCard, updateCard } from "../../utils/api_cards";
import { uploadImage } from "../../utils/api_images";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Clear, Upload } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import NotFound from "../NotFound";

export default function CardForm({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id, role, token } = {} } = cookies;

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
    data: card, // no `=[]` to avoid controlled -> uncontrolled input fields
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["card", id],
    queryFn: () => getCard(id),
    enabled: type === "edit" ? true : false, // does not query when type === "add"
  });

  useEffect(() => {
    if (!cookies.session) {
      enqueueSnackbar(`Log in to ${type} cards.`);
      navigate("/login");
    }
    if (card) {
      if (type === "edit" && !(_id === card.creator || role === "admin")) {
        enqueueSnackbar("Access forbidden.", {
          variant: "error",
        });
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
  }, [card]);

  const mutationUploadFImage = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setFImage(data.image_url);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
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
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const handleUploadBImage = (e) => {
    mutationUploadBImage.mutate(e.target.files[0]);
  };

  const mutationSaveCard = useMutation({
    mutationFn: type === "add" ? addCard : updateCard,
    onSuccess: () => {
      enqueueSnackbar(`Card ${type === "add" ? "added" : "updated"}.`, {
        variant: "success",
      });
      navigate("/cards");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const handleSaveCard = () => {
    if (fTitle === "" || bTitle === "" || category === "") {
      enqueueSnackbar("Front title, back title and category are required.", {
        variant: "error",
      });
    } else {
      mutationSaveCard.mutate({
        _id: type === "edit" ? id : null,
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

  if (isLoading) {
    return (
      <Box align="center">
        Loading...
        <LoadingButton loading></LoadingButton>
      </Box>
    );
  }

  if (isError) {
    return <NotFound type="card" />;
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold">
              {type === "add" ? "Create a new card" : "Edit an existing card"}
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Typography variant="subtitle">Front Title</Typography>
            <Typography variant="subtitle" color="red">
              *
            </Typography>
            <TextField
              autoFocus={type === "add"}
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
            <Typography variant="subtitle">Front Description</Typography>
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
                    src={`http://localhost:1337/${fImage}`}
                    width="128px"
                    height="128px"
                    alt={fImage}
                  />
                  <IconButton color="error" onClick={() => setFImage("")}>
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
                    src={`http://localhost:1337/${bImage}`}
                    width="128px"
                    height="128px"
                    alt={bImage}
                  />
                  <IconButton color="error" onClick={() => setBImage("")}>
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
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              sx={{ textTransform: "capitalize", mt: 0.5 }}
              onClick={handleSaveCard}
            >
              {type === "add" ? "Add Card" : "Update Card"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { deleteCard } from "../../utils/api_cards";
// import { addCartItem } from "../../utils/api_cart";

import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Close,
  Delete,
  Edit,
  Info,
  LibraryAdd,
  Visibility,
  Send,
  Cancel,
} from "@mui/icons-material";
import Flashcard from "../Flashcard";

export default function CardCard({ card }) {
  const { _id, fTitle, fDesc, bTitle, bDesc, category, creator } = card;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id: user_id, role, token } = {} } = cookies;

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const mutationDeleteCard = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      enqueueSnackbar("Card deleted.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleDeleteCard = () => {
    if (window.confirm("Delete card?"))
      mutationDeleteCard.mutate({ _id, token });
  };

  // const addCartItemMutation = useMutation({
  //   mutationFn: addCartItem,
  //   onSuccess: () => {
  //     // success message
  //     enqueueSnackbar("Item added to cart.", {
  //       variant: "success",
  //     });
  //   },
  //   onError: (error) => {
  //     // error message
  //     enqueueSnackbar(error.response.data.message, {
  //       variant: "error",
  //     });
  //   },
  // });

  return (
    <>
      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
            <Chip
              size="small"
              icon={<AccountCircle />}
              label={
                <Typography variant="inherit" noWrap>
                  {creator ? creator.username : "-"}
                </Typography>
              }
              style={{ maxWidth: "48%" }}
            />
            <Chip
              size="small"
              icon={<Info />}
              label={
                <Typography variant="inherit" noWrap>
                  {category ? category.name : "-"}
                </Typography>
              }
              style={{ maxWidth: "48%" }}
            />
          </Box>
          <Typography fontWeight="bold" noWrap>
            {fTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              fontStyle: fDesc ? null : "italic",
            }}
            gutterBottom
            noWrap
          >
            {fDesc ? fDesc : "No description added."}
          </Typography>
          <Typography fontWeight="bold" noWrap>
            {bTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ fontStyle: fDesc ? null : "italic" }}
            noWrap
          >
            {bDesc ? bDesc : "No description added."}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton
            size="small"
            onClick={() => {
              setOpenPreviewModal(true);
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton size="small">
            <LibraryAdd />
          </IconButton>
          {creator?._id === user_id || role === "admin" ? (
            <>
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  navigate(`/cards/${_id}/edit`);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton color="error" size="small" onClick={handleDeleteCard}>
                <Delete />
              </IconButton>
            </>
          ) : null}
        </CardActions>
      </Card>

      <Dialog
        open={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
      >
        {/* <AppBar position="relative"> */}
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            Preview
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenPreviewModal(false)}
          >
            <Close />
          </IconButton>
        </Toolbar>
        {/* </AppBar> */}
        {/* <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Preview</Typography>
          <IconButton onClick={() => setOpenPreviewModal(false)}>
            <Close />
          </IconButton>
        </DialogTitle> */}
        <DialogContent>
          <Flashcard card={card} />
        </DialogContent>
      </Dialog>
    </>
  );
}

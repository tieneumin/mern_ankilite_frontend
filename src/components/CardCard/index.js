import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { deleteCard } from "../../utils/api_cards";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Close,
  Delete,
  Info,
  Visibility,
} from "@mui/icons-material";

import FormDialogButton from "../FormDialogButton";
import Flashcard from "../Flashcard";

export default function CardCard({
  card,
  details,
  checkbox,
  editCards,
  setEditCards,
}) {
  const { _id, fTitle, fDesc, bTitle, bDesc, category, creator } = card;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id: user_id, role, token } = {} } = cookies;

  const [previewDialog, setPreviewDialog] = useState(false);

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

  const handleCardsInDeck = (cardId) => {
    if (!editCards?.includes(cardId)) {
      setEditCards([...editCards, cardId]);
    } else {
      setEditCards(editCards.filter((id) => id !== cardId));
    }
  };

  return (
    <>
      <Card>
        <CardContent sx={{ pb: 1 }}>
          {!details ? (
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
          ) : null}

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
          <Box flex="1">
            <IconButton
              size="small"
              onClick={() => {
                setPreviewDialog(true);
              }}
            >
              <Visibility />
            </IconButton>
            {creator?._id === user_id || role === "admin" ? (
              <>
                <FormDialogButton operation="edit" type="card" id={_id} />
                <IconButton
                  color="error"
                  size="small"
                  onClick={handleDeleteCard}
                >
                  <Delete />
                </IconButton>
              </>
            ) : null}
          </Box>
          {checkbox ? (
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={editCards?.includes(_id)}
                  onChange={() => handleCardsInDeck(_id)}
                />
              }
            />
          ) : null}
        </CardActions>
      </Card>

      <Dialog
        fullWidth
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
      >
        <DialogTitle display="flex" alignItems="center">
          <Typography variant="inherit" flex="1">
            Preview
          </Typography>
          <IconButton onClick={() => setPreviewDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Flashcard card={card} />
        </DialogContent>
      </Dialog>
    </>
  );
}

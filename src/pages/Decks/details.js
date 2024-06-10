import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getDeck, updateDeck, deleteDeck } from "../../utils/api_decks";
import { getCards } from "../../utils/api_cards";

import {
  AppBar,
  Box,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close, Delete, LibraryAdd, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import Navbar from "../../components/Navbar";
import NotFound from "../../components/NotFound";
import FormDialogButton from "../../components/FormDialogButton";
import DeckCard from "../../components/DeckCard";
import CardCard from "../../components/CardCard";
import Filters from "../../components/Filters";

export default function DeckDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id, role, token } = {} } = cookies;

  const [category, setCategory] = useState("all");

  const [editDialog, setEditDialog] = useState(false);
  const [editCards, setEditCards] = useState([]);

  const { data: cards = [] } = useQuery({
    queryKey: ["cards", category],
    queryFn: () => getCards(category),
  });

  const {
    data: deck,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(id),
  });

  useEffect(() => {
    if (deck) {
      setEditCards(deck.cards.map((card) => card?._id));
    }
  }, [deck]);

  const mutationUpdateDeck = useMutation({
    mutationFn: updateDeck,
    onSuccess: () => {
      enqueueSnackbar("Deck updated.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["deck"] });
      setEditDialog(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleUpdateDeck = () => {
    mutationUpdateDeck.mutate({
      ...deck,
      cards: editCards,
      token,
    });
  };

  const mutationDeleteDeck = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      enqueueSnackbar("Deck deleted.", { variant: "success" });
      navigate("/decks");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleDeleteDeck = () => {
    if (window.confirm("Delete deck?"))
      mutationDeleteDeck.mutate({ _id: id, token });
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Box align="center">
          Loading...
          <LoadingButton loading></LoadingButton>
        </Box>
      ) : isError ? (
        <NotFound type="deck" />
      ) : (
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mr: 1.25 }}>
              Deck Details
            </Typography>
            {deck.creator?._id === _id || role === "admin" ? (
              <>
                <FormDialogButton
                  operation="edit"
                  type="deck"
                  id={id}
                  sx={{ p: 0 }}
                />
                <IconButton
                  color="error"
                  size="small"
                  onClick={handleDeleteDeck}
                >
                  <Delete />
                </IconButton>
              </>
            ) : null}
          </Box>
          <DeckCard type="details" deck={deck} />
          <Divider sx={{ mt: 3, mb: 1 }} />

          <Box display="flex" alignItems="center" sx={{ my: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mr: 1.25 }}>
              Cards ({deck.cards.length})
            </Typography>
            {deck.creator?._id === _id || role === "admin" ? (
              <IconButton
                color="primary"
                onClick={() => {
                  setEditDialog(true);
                }}
              >
                <LibraryAdd />
              </IconButton>
            ) : null}
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {deck.cards.length > 0 ? (
              deck.cards.map((card) => {
                return (
                  <Grid key={card._id} item md={4} sm={6} xs={12}>
                    <CardCard card={card} details />
                  </Grid>
                );
              })
            ) : (
              <Grid item flex="1">
                <Typography fontStyle="italic" textAlign="center">
                  No cards in deck.
                </Typography>
              </Grid>
            )}
          </Grid>

          <Dialog
            fullWidth
            maxWidth="xl"
            open={editDialog}
            onClose={() => setEditDialog(false)}
          >
            <AppBar position="relative">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  sx={{ mr: 1 }}
                  onClick={() => setEditDialog(false)}
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" flex="1">
                  Edit cards in deck
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleUpdateDeck}
                >
                  <Save />
                </IconButton>
              </Toolbar>
            </AppBar>
            <DialogContent>
              <Filters
                type="card"
                category={category}
                setCategory={setCategory}
              />
              <Grid container spacing={1}>
                {cards.length > 0 ? (
                  cards.map((card) => {
                    return (
                      <Grid key={card._id} item md={4} sm={6} xs={12}>
                        <CardCard
                          card={card}
                          checkbox
                          editCards={editCards}
                          setEditCards={setEditCards}
                        />
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item flex="1">
                    <Typography fontStyle="italic" textAlign="center">
                      No cards found.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
          </Dialog>
        </Container>
      )}
    </>
  );
}

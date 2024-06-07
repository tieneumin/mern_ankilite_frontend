import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";
import { getCard, addCard, updateCard, getCards } from "../../utils/api_cards";
import { uploadImage } from "../../utils/api_images";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Clear,
  Delete,
  Edit,
  Info,
  LibraryAdd,
  Upload,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { Container } from "@mui/material";

import Navbar from "../../components/Navbar";
import { getDeck } from "../../utils/api_decks";
import CardCard from "../../components/CardCard";
import NotFound from "../../components/NotFound";

export default function DeckDetails() {
  // !! error if unlogged in user accesses
  // Cannot read properties of undefined (reading 'includes')
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id: user_id, role, token } = {} } = cookies;

  const { data: allCards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: () => getCards(),
  });

  const [aa, setCards] = useState([]);

  const { data: deck = [] } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(id),
  });
  const { title, description, category, creator, cards } = deck;

  // useEffect(() => {
  //   if (deck) {
  //     if (user_id === deck.creator || role === "admin") {
  //       enqueueSnackbar("Action forbidden.", {
  //         variant: "error",
  //       });
  //       navigate("/cards");
  //     }
  //     setCards(deck.cards);
  //   }
  // }, [deck]);

  console.log(category);
  const handleCards = (card_id) => {
    if (!cards.includes(card_id)) {
      setCards([...cards, card_id]);
    } else {
      setCards(cards.filter((id) => id !== card_id));
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Card>
          <CardContent sx={{ pb: 0 }}>
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
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{
                fontStyle: description ? null : "italic",
                wordBreak: "break-word",
              }}
            >
              {description ? description : "No description added."}
            </Typography>
          </CardContent>
          {creator?._id === user_id || role === "admin" ? (
            <CardActions style={{ display: "flex", justifyContent: "end" }}>
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  navigate(`/decks/${id}/edit`);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                // onClick={handleDeleteDeck}
              >
                <Delete />
              </IconButton>
            </CardActions>
          ) : null}
        </Card>

        <Grid item xs={12}>
          <Typography variant="subtitle">Select Cards:</Typography>
          <Grid container spacing={1}>
            {allCards.map((c) => (
              <Grid key={c._id} item md={4} sm={6} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={cards.includes(c._id)}
                      onChange={() => handleCards(c._id)}
                    />
                  }
                  label={`${c.fTitle} / ${c.bTitle} `}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {cards && cards.length > 0 ? (
            cards.map((card) => {
              return (
                <Grid key={card._id} item md={4} sm={6} xs={12}>
                  <CardCard card={card} />
                </Grid>
              );
            })
          ) : (
            <Grid item>
              <Typography align="center">No cards found.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

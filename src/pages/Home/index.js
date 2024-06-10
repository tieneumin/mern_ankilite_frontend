import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { getDecks } from "../../utils/api_decks";
import { getCards } from "../../utils/api_cards";

import { Container, Divider, Grid, Typography } from "@mui/material";

import Navbar from "../../components/Navbar";
import Filters from "../../components/Filters";
import CardCard from "../../components/CardCard";
import DeckCard from "../../components/DeckCard";

export default function Home() {
  const [cookies] = useCookies(["session"]);
  const { session: { _id } = {} } = cookies;

  const [deckCategory, setDeckCategory] = useState("all");
  const [cardCategory, setCardCategory] = useState("all");

  const [filteredDecks, setFilteredDecks] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  const { data: decks = [] } = useQuery({
    queryKey: ["decks", deckCategory],
    queryFn: () => getDecks(deckCategory),
  });
  const { data: cards = [] } = useQuery({
    queryKey: ["cards", cardCategory],
    queryFn: () => getCards(cardCategory),
  });

  useEffect(() => {
    if (_id) {
      setFilteredDecks(decks.filter((d) => d.creator._id === _id));
      setFilteredCards(cards.filter((c) => c.creator._id === _id));
    } else {
      setFilteredDecks(decks);
      setFilteredCards(cards);
    }
  }, [decks, cards, _id]);

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Filters
          type="deck"
          category={deckCategory}
          setCategory={setDeckCategory}
        />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {filteredDecks.length > 0 ? (
            filteredDecks.map((deck) => {
              return (
                <Grid key={deck._id} item md={4} sm={6} xs={12}>
                  <DeckCard type="index" deck={deck} />
                </Grid>
              );
            })
          ) : (
            <Grid item flex="1">
              <Typography fontStyle="italic" textAlign="center">
                No decks found.
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Filters
          type="card"
          category={cardCategory}
          setCategory={setCardCategory}
        />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => {
              return (
                <Grid key={card._id} item md={4} sm={6} xs={12}>
                  <CardCard card={card} />
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
      </Container>
    </>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getDecks } from "../../utils/api_decks";

import { Container, Grid, Typography } from "@mui/material";

import Navbar from "../../components/Navbar";
import Filters from "../../components/Filters";
import DeckCard from "../../components/DeckCard";

export default function Decks() {
  const [category, setCategory] = useState("all");

  const { data: decks = [] } = useQuery({
    queryKey: ["decks", category],
    queryFn: () => getDecks(category),
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Filters type="deck" category={category} setCategory={setCategory} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {decks.length > 0 ? (
            decks.map((deck) => {
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
      </Container>
    </>
  );
}

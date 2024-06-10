import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCards } from "../../utils/api_cards";

import { Container, Grid, Typography } from "@mui/material";

import Navbar from "../../components/Navbar";
import Filters from "../../components/Filters";
import CardCard from "../../components/CardCard";

export default function Cards() {
  const [category, setCategory] = useState("all");

  const { data: cards = [] } = useQuery({
    queryKey: ["cards", category],
    queryFn: () => getCards(category),
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Filters type="card" category={category} setCategory={setCategory} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {cards.length > 0 ? (
            cards.map((card) => {
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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";
import { getCards } from "../../utils/api_cards";

import {
  Box,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";

import Navbar from "../../components/Navbar";
import CardCard from "../../components/CardCard";

export default function Cards() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["session"]);
  // const { session: { _id, token } = {} } = cookies;

  const [category, setCategory] = useState("all");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: cards = [] } = useQuery({
    queryKey: ["cards", category],
    queryFn: () => getCards(category),
  });

  // const { data: decks = [] } = useQuery({
  //   queryKey: ["decks", category, creator],
  //   queryFn: () => getDecks(category, creator),
  // });
  // console.log(creator);
  // console.log(decks);

  console.log(cards); // quick data access
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box display="flex" sx={{ my: 3 }}>
          <Box display="flex" alignItems="center" style={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Cards
            </Typography>
            {cookies.session ? (
              <IconButton
                color="primary"
                onClick={() => {
                  navigate("/cards/add");
                }}
              >
                <AddCircle />
              </IconButton>
            ) : null}
          </Box>
          <FormControl size="small" style={{ width: "150px" }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((c) => {
                return (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

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
            <Grid item>
              <Typography fontStyle="italic">No cards found.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

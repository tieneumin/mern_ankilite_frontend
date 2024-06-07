import { Link } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

export default function NotFound({ type }) {
  return (
    <Box align="center">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {type === "card"
          ? "404: Card Not Found"
          : type === "deck"
          ? "404: Deck Not Found"
          : "404: Page Not Found"}
      </Typography>
      {type === "card" ? (
        <Button component={Link} to="/cards">
          Back To Cards
        </Button>
      ) : type === "deck" ? (
        <Button component={Link} to="/decks">
          Back To Decks
        </Button>
      ) : (
        <Button component={Link} to="/">
          Back To Home
        </Button>
      )}
    </Box>
  );
}

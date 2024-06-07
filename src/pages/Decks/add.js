import { Container } from "@mui/material";

import Navbar from "../../components/Navbar";
import DeckForm from "../../components/DeckForm";

export default function DeckAdd() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <DeckForm type="add" />
      </Container>
    </>
  );
}

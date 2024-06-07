import { Container } from "@mui/material";

import Navbar from "../../components/Navbar";
import CardForm from "../../components/CardForm";

export default function CardEdit() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <CardForm type="edit" />
      </Container>
    </>
  );
}

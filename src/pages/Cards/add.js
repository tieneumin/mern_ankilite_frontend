import { Container } from "@mui/material";

import Navbar from "../../components/Navbar";
import CardForm from "../../components/CardForm";

export default function CardAdd() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <CardForm type="add" />
      </Container>
    </>
  );
}

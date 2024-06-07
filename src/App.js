import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { CookiesProvider } from "react-cookie";

import SignUp from "./pages/Auth/signup";
import Login from "./pages/Auth/login";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Categories from "./pages/Categories";

import Cards from "./pages/Cards/index";
import CardAdd from "./pages/Cards/add";
import CardEdit from "./pages/Cards/edit";

import Decks from "./pages/Decks/index";
import DeckAdd from "./pages/Decks/add";
import DeckDetails from "./pages/Decks/details";
import DeckEdit from "./pages/Decks/edit";

import PageNotFound from "./pages/404";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <SnackbarProvider
        // maxSnack={3}
        // autoHideDuration={2000}
        // anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cards">
                <Route index element={<Cards />} />
                <Route path="add" element={<CardAdd />} />
                <Route path=":id/edit" element={<CardEdit />} />
              </Route>
              <Route path="/decks">
                <Route index element={<Decks />} />
                <Route path="add" element={<DeckAdd />} />
                <Route path=":id" element={<DeckDetails />} />
                <Route path=":id/edit" element={<DeckEdit />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}

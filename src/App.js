import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { CookiesProvider } from "react-cookie";

import Home from "./pages/Home";
import SignUp from "./pages/Auth/signup";
import Login from "./pages/Auth/login";

import Cards from "./pages/Cards/index";
import Decks from "./pages/Decks/index";
import DeckDetails from "./pages/Decks/details";

import Categories from "./pages/Categories";
import Users from "./pages/Users";
import PageNotFound from "./pages/404";

import SnackbarCloseButton from "./components/SnackbarCloseButton";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <SnackbarProvider
          action={(snackbarKey) => (
            <SnackbarCloseButton snackbarKey={snackbarKey} />
          )}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/decks">
                <Route index element={<Decks />} />
                <Route path=":id" element={<DeckDetails />} />
              </Route>
              <Route path="/users" element={<Users />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}

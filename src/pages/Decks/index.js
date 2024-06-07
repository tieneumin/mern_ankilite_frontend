import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";
import { getDecks, deleteDeck } from "../../utils/api_decks";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  AddCircle,
  Delete,
  Description,
  Edit,
  Info,
} from "@mui/icons-material";

import Navbar from "../../components/Navbar";

export default function Decks() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id: user_id, role, token } = {} } = cookies;

  const [category, setCategory] = useState("all");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: decks = [] } = useQuery({
    queryKey: ["decks", category],
    queryFn: () => getDecks(category),
  });

  const mutationDeleteDeck = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      enqueueSnackbar("Deck deleted.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleDeleteDeck = (_id) => {
    if (window.confirm("Delete deck?"))
      mutationDeleteDeck.mutate({ _id, token });
  };

  console.log(decks); // quick data access
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box display="flex" sx={{ my: 3 }}>
          <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Decks
            </Typography>
            {cookies.session ? (
              <IconButton
                color="primary"
                onClick={() => {
                  navigate("/decks/add");
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
          {decks.length > 0 ? (
            decks.map((d) => {
              return (
                <Grid key={d._id} item md={4} sm={6} xs={12}>
                  <Card>
                    <CardContent sx={{ pb: 1 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Chip
                          size="small"
                          icon={<AccountCircle />}
                          label={
                            <Typography variant="inherit" noWrap>
                              {d.creator ? d.creator.username : "-"}
                            </Typography>
                          }
                          style={{ maxWidth: "48%" }}
                        />
                        <Chip
                          size="small"
                          icon={<Info />}
                          label={
                            <Typography variant="inherit" noWrap>
                              {d.category ? d.category.name : "-"}
                            </Typography>
                          }
                          style={{ maxWidth: "48%" }}
                        />
                      </Box>
                      <Typography fontWeight="bold" noWrap>
                        ({d.cards.length}) {d.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ fontStyle: d.description ? null : "italic" }}
                        noWrap
                      >
                        {d.description
                          ? d.description
                          : "No description added."}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigate(`/decks/${d._id}`);
                        }}
                      >
                        <Description />
                      </IconButton>
                      {d.creator?._id === user_id || role === "admin" ? (
                        <>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              navigate(`/decks/${d._id}/edit`);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteDeck(d._id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      ) : null}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item>
              <Typography fontStyle="italic">No decks found.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

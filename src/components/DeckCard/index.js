import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { autop } from "@wordpress/autop";

import { deleteDeck } from "../../utils/api_decks";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { AccountCircle, Delete, Description, Info } from "@mui/icons-material";

import FormDialogButton from "../../components/FormDialogButton";

export default function DeckCard({ type, deck }) {
  const { _id, title, description, category, creator, cards } = deck;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id: user_id, role, token } = {} } = cookies;

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
  const handleDeleteDeck = () => {
    if (window.confirm("Delete deck?"))
      mutationDeleteDeck.mutate({ _id, token });
  };

  return (
    <Card>
      <CardContent
        sx={{
          pb: type === "index" ? 1 : null,
          height: type === "index" ? "125px" : null,
        }}
      >
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Chip
            size="small"
            icon={<AccountCircle />}
            label={
              <Typography variant="inherit" noWrap>
                {creator ? creator.username : "-"}
              </Typography>
            }
            style={{ maxWidth: "48%" }}
          />
          <Chip
            size="small"
            icon={<Info />}
            label={
              <Typography variant="inherit" noWrap>
                {category ? category.name : "-"}
              </Typography>
            }
            style={{ maxWidth: "48%" }}
          />
        </Box>
        {type === "index" ? (
          <Typography fontWeight="bold" noWrap>
            ({cards.length}) {title}
          </Typography>
        ) : (
          <Typography fontWeight="bold" style={{ wordBreak: "break-word" }}>
            {title}
          </Typography>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            wordWrap: "break-word",
            fontStyle: description ? null : "italic",
            overflow: type === "index" ? "hidden" : null,
            display: type === "index" ? "-webkit-box" : null,
            WebkitLineClamp: type === "index" ? "4" : null,
            WebkitBoxOrient: type === "index" ? "vertical" : null,
            lineHeight: type === "index" ? "1.1rem" : null,
          }}
        >
          {description
            ? autop(description)
                .split("\n")
                .map((text, i) => (
                  <span key={i} dangerouslySetInnerHTML={{ __html: text }} />
                ))
            : "No description added."}
        </Typography>
      </CardContent>
      {type === "index" ? (
        <CardActions disableSpacing>
          <IconButton
            size="small"
            onClick={() => {
              navigate(`/decks/${_id}`);
            }}
          >
            <Description />
          </IconButton>
          {creator?._id === user_id || role === "admin" ? (
            <>
              <FormDialogButton operation="edit" type="deck" id={_id} />
              <IconButton color="error" size="small" onClick={handleDeleteDeck}>
                <Delete />
              </IconButton>
            </>
          ) : null}
        </CardActions>
      ) : null}
    </Card>
  );
}

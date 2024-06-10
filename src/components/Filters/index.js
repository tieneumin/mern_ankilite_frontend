import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import FormDialogButton from "../FormDialogButton";

export default function Filters(props) {
  const { type, category, setCategory } = props;
  const [cookies] = useCookies(["session"]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <Box display="flex" sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" flex="1">
        <Typography variant="h5" fontWeight="bold">
          {type === "card" ? "Cards" : "Decks"}
        </Typography>
        {cookies.session ? (
          <FormDialogButton operation="add" type={type} />
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
  );
}

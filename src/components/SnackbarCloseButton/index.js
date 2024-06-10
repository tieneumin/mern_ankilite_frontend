import { useSnackbar } from "notistack";

import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarKey)}>
      <Close />
    </IconButton>
  );
}

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { signUpUser } from "../../utils/api_auth";

import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import Navbar from "../../components/Navbar";

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["session"]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (cookies.session) {
      enqueueSnackbar("You are already logged in.");
      navigate("/");
    }
  });

  const mutationSignUp = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      enqueueSnackbar("Account created.", { variant: "success" });
      navigate("/login");
    },
    onError: (error) => {
      error.response.data.message.split(",").forEach((e) => {
        enqueueSnackbar(e, { variant: "error" });
      });
    },
  });

  const handleSignUp = () => {
    const error = [];
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    )
      error.push("All fields are required.");
    if (password.length < 8 || confirmPassword.length < 8)
      error.push("Password must be at least 8 characters.");
    if (password !== confirmPassword) error.push("Passwords do not match.");

    if (error.length > 0) {
      error.forEach((e) => {
        enqueueSnackbar(e, { variant: "error" });
      });
    } else {
      mutationSignUp.mutate({ username, email, password });
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight="bold" align="center">
                  Create a new account
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="subtitle">Username</Typography>
                <Typography variant="subtitle" color="red">
                  *
                </Typography>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  sx={{ mt: 0.5 }}
                  value={username}
                  inputProps={{ maxLength: 24 }}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="subtitle">Email</Typography>
                <Typography variant="subtitle" color="red">
                  *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={{ mt: 0.5 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="subtitle">Password</Typography>
                <Typography variant="subtitle" color="red">
                  *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={{ mt: 0.5 }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="subtitle">Confirm Password</Typography>
                <Typography variant="subtitle" color="red">
                  *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={{ mt: 0.5 }}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 0.5, textTransform: "capitalize" }}
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

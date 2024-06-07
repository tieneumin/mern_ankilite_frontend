import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { loginUser } from "../../utils/api_auth";

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

export default function Login() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie] = useCookies(["session"]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (cookies.session) {
      enqueueSnackbar("You are already logged in.");
      navigate("/");
    }
  });

  const mutationLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setCookie("session", data, { maxAge: 30 * 24 * 60 * 60 });
      enqueueSnackbar("Login successful.", { variant: "success" });
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleLogin = () => {
    if (email === "" || password === "") {
      enqueueSnackbar("Please enter your login details.", { variant: "error" });
    } else {
      mutationLogin.mutate({ email, password });
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
                  Log in to your account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  placeholder="Email address"
                  sx={{ mt: 0.5 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Password"
                  type="password"
                  sx={{ mt: 0.5 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ textTransform: "capitalize", mt: 0.5 }}
                  onClick={handleLogin}
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

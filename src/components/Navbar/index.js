import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StyleIcon from "@mui/icons-material/Style";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cookies, setCookie, removeCookie] = useCookies(["session"]);
  const { session: { role } = {} } = cookies;

  const [openNavMenu, setOpenNavMenu] = useState(false);

  const handleLogout = () => {
    removeCookie("session");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          sx={{ mr: 1.5, flex: { sm: 0, xs: 1 } }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => {
              navigate("/");
            }}
          >
            <StyleIcon />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight="bold"
            component={Link}
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            AnkiLite
          </Typography>
        </Box>

        <Box
          sx={{
            display: { sm: "flex", xs: "none" },
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <Box>
            <Button
              style={{
                color: location.pathname === "/cards" ? "#1976d2" : "inherit",
                backgroundColor:
                  location.pathname === "/cards" ? "white" : null,
                fontWeight: location.pathname === "/cards" ? "bold" : null,
              }}
              onClick={() => navigate("/cards")}
            >
              Cards
            </Button>
            <Button
              style={{
                color: location.pathname === "/decks" ? "#1976d2" : "inherit",
                backgroundColor:
                  location.pathname === "/decks" ? "white" : null,
                fontWeight: location.pathname === "/decks" ? "bold" : null,
              }}
              onClick={() => navigate("/decks")}
            >
              Decks
            </Button>
            {role === "admin" ? (
              <>
                <Button
                  style={{
                    color:
                      location.pathname === "/categories"
                        ? "#1976d2"
                        : "inherit",
                    backgroundColor:
                      location.pathname === "/categories" ? "white" : null,
                    fontWeight:
                      location.pathname === "/categories" ? "bold" : null,
                  }}
                  onClick={() => navigate("/categories")}
                >
                  Categories
                </Button>
                <Button
                  style={{
                    color:
                      location.pathname === "/users" ? "#1976d2" : "inherit",
                    backgroundColor:
                      location.pathname === "/users" ? "white" : null,
                    fontWeight: location.pathname === "/users" ? "bold" : null,
                  }}
                  onClick={() => navigate("/users")}
                >
                  Users
                </Button>
              </>
            ) : null}
          </Box>

          <Box>
            {role ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button
                  style={{
                    color:
                      location.pathname === "/login" ? "#1976d2" : "inherit",
                    backgroundColor:
                      location.pathname === "/login" ? "white" : null,
                    fontWeight: location.pathname === "/login" ? "bold" : null,
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  style={{
                    color:
                      location.pathname === "/signup" ? "#1976d2" : "inherit",
                    backgroundColor:
                      location.pathname === "/signup" ? "white" : null,
                    fontWeight: location.pathname === "/signup" ? "bold" : null,
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: { sm: "none", xs: "flex" } }}>
          <IconButton
            color="inherit"
            sx={{ pr: 0 }}
            onClick={() => setOpenNavMenu(true)}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            sx={{ display: { sm: "none", xs: "block" } }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={openNavMenu}
            onClose={() => setOpenNavMenu(false)}
          >
            <MenuItem onClick={() => navigate("/cards")}>
              <Typography
                style={{
                  color: location.pathname === "/cards" ? "#1976d2" : null,
                  fontWeight: location.pathname === "/cards" ? "bold" : null,
                }}
              >
                Cards
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate("/decks")}>
              <Typography
                style={{
                  color: location.pathname === "/decks" ? "#1976d2" : null,
                  fontWeight: location.pathname === "/decks" ? "bold" : null,
                }}
              >
                Decks
              </Typography>
            </MenuItem>
            {role === "admin" ? (
              <Box>
                <MenuItem onClick={() => navigate("/categories")}>
                  <Typography
                    style={{
                      color:
                        location.pathname === "/categories" ? "#1976d2" : null,
                      fontWeight:
                        location.pathname === "/categories" ? "bold" : null,
                    }}
                  >
                    Categories
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/users")}>
                  <Typography
                    style={{
                      color: location.pathname === "/users" ? "#1976d2" : null,
                      fontWeight:
                        location.pathname === "/users" ? "bold" : null,
                    }}
                  >
                    Users
                  </Typography>
                </MenuItem>
              </Box>
            ) : null}
            <Divider />
            {role ? (
              <MenuItem onClick={handleLogout}>
                <Typography>Logout</Typography>
              </MenuItem>
            ) : (
              <Box>
                <MenuItem onClick={() => navigate("/login")}>
                  <Typography
                    style={{
                      color: location.pathname === "/login" ? "#1976d2" : null,
                      fontWeight:
                        location.pathname === "/login" ? "bold" : null,
                    }}
                  >
                    Login
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/signup")}>
                  <Typography
                    style={{
                      color: location.pathname === "/signup" ? "#1976d2" : null,
                      fontWeight:
                        location.pathname === "/signup" ? "bold" : null,
                    }}
                  >
                    Sign Up
                  </Typography>
                </MenuItem>
              </Box>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

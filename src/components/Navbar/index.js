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
            color="inherit"
            edge="start"
            size="large"
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
            {["cards", "decks"].map((x1, i) => {
              return (
                <Button
                  key={i}
                  style={{
                    color:
                      location.pathname === `/${x1}` ? "#1976d2" : "inherit",
                    backgroundColor:
                      location.pathname === `/${x1}` ? "white" : null,
                    fontWeight: location.pathname === `/${x1}` ? "bold" : null,
                  }}
                  onClick={() => navigate(`/${x1}`)}
                >
                  {x1}
                </Button>
              );
            })}
            {role === "admin"
              ? ["categories", "users"].map((x2, i) => {
                  return (
                    <Button
                      key={i}
                      style={{
                        color:
                          location.pathname === `/${x2}`
                            ? "#1976d2"
                            : "inherit",
                        backgroundColor:
                          location.pathname === `/${x2}` ? "white" : null,
                        fontWeight:
                          location.pathname === `/${x2}` ? "bold" : null,
                      }}
                      onClick={() => navigate(`/${x2}`)}
                    >
                      {x2}
                    </Button>
                  );
                })
              : null}
          </Box>

          <Box>
            {role ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              ["login", "signup"].map((x3, i) => {
                return (
                  <Button
                    key={i}
                    style={{
                      color:
                        location.pathname === `/${x3}` ? "#1976d2" : "inherit",
                      backgroundColor:
                        location.pathname === `/${x3}` ? "white" : null,
                      fontWeight:
                        location.pathname === `/${x3}` ? "bold" : null,
                    }}
                    onClick={() => navigate(`/${x3}`)}
                  >
                    {x3}
                  </Button>
                );
              })
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
            {["cards", "decks"].map((x1r, i) => {
              return (
                <MenuItem key={i} onClick={() => navigate(`/${x1r}`)}>
                  <Typography
                    style={{
                      color: location.pathname === `/${x1r}` ? "#1976d2" : null,
                      fontWeight:
                        location.pathname === `/${x1r}` ? "bold" : null,
                      textTransform: "capitalize",
                    }}
                  >
                    {x1r}
                  </Typography>
                </MenuItem>
              );
            })}
            {role === "admin"
              ? ["categories", "users"].map((x2r, i) => {
                  return (
                    <MenuItem key={i} onClick={() => navigate(`/${x2r}`)}>
                      <Typography
                        style={{
                          color:
                            location.pathname === `/${x2r}` ? "#1976d2" : null,
                          fontWeight:
                            location.pathname === `/${x2r}` ? "bold" : null,
                          textTransform: "capitalize",
                        }}
                      >
                        {x2r}
                      </Typography>
                    </MenuItem>
                  );
                })
              : null}
            <Divider />
            {role ? (
              <MenuItem onClick={handleLogout}>
                <Typography>Logout</Typography>
              </MenuItem>
            ) : (
              ["login", "signup"].map((x3r, i) => {
                return (
                  <MenuItem key={i} onClick={() => navigate(`/${x3r}`)}>
                    <Typography
                      style={{
                        color:
                          location.pathname === `/${x3r}` ? "#1976d2" : null,
                        fontWeight:
                          location.pathname === `/${x3r}` ? "bold" : null,
                        textTransform: "capitalize",
                      }}
                    >
                      {x3r}
                    </Typography>
                  </MenuItem>
                );
              })
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

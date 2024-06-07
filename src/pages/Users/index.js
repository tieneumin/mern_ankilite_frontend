import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import { getUsers, updateUser } from "../../utils/api_users";

import {
  Container,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import Navbar from "../../components/Navbar";

export default function Users() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [cookies] = useCookies(["session"]);
  const { session: { _id: user_id, role: user_role, token } = {} } = cookies;

  const { data: users = [] } = useQuery({
    queryKey: ["users", token],
    queryFn: () => getUsers(token),
  });

  useEffect(() => {
    if (user_role !== "admin") {
      enqueueSnackbar("Access forbidden.", { variant: "error" });
      navigate("/");
    }
  });

  const mutationUpdateUser = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      enqueueSnackbar("Role updated.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });
  const handleUpdateUser = (_id, role) => {
    if (role === "admin" || role === "user") {
      mutationUpdateUser.mutate({ _id, role, token });
    } else {
      enqueueSnackbar("Invalid role.", { variant: "error" });
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Users
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small" style={{ fontWeight: "bold" }}>
                  Username
                </TableCell>
                <TableCell size="small" style={{ fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell
                  size="small"
                  align="right"
                  style={{ fontWeight: "bold" }}
                >
                  Role
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0
                ? users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell
                        size="small"
                        style={{ wordBreak: "break-word" }}
                      >
                        {u.username}
                      </TableCell>
                      <TableCell
                        size="small"
                        style={{ wordBreak: "break-word" }}
                      >
                        {u.email}
                      </TableCell>
                      <TableCell size="small" align="right">
                        <Select
                          size="small"
                          value={u.role}
                          disabled={u._id === user_id}
                          style={{ width: "100px" }}
                          onChange={(e) =>
                            handleUpdateUser(u._id, e.target.value)
                          }
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="user">User</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

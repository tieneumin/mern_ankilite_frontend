import axios from "axios";

import { url } from "./data";

// GET /users (admin)
export const getUsers = async (token) => {
  const res = await axios.get(`${url}/users`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
};

// PUT /users/:id (admin)
export const updateUser = async (data) => {
  const res = await axios.put(
    `${url}/users/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return res.data;
};

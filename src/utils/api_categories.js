import axios from "axios";

import { url } from "./data";

// GET /categories
export const getCategories = async () => {
  const res = await axios.get(`${url}/categories`);
  return res.data;
};

// POST /categories (admin)
export const addCategory = async (data) => {
  const res = await axios.post(`${url}/categories`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

// PUT /categories/:id (admin)
export const updateCategory = async (data) => {
  const res = await axios.put(
    `${url}/categories/${data._id}`,
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

// DELETE /categories/:id (admin)
export const deleteCategory = async (data) => {
  const res = await axios.delete(`${url}/categories/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

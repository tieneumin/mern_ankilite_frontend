import axios from "axios";

import { url } from "./data";

// GET /cards
export const getCards = async (category = "all") => {
  // prev params: category, page, perPage
  // add user for home filter
  const params = {
    //   page,
    //   perPage,
  };
  if (category !== "all") params.category = category; // ?category=category
  // console.log(params.category);
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/cards?${query.toString()}`);
  return res.data;
};

// GET /cards/:id
export const getCard = async (id) => {
  const res = await axios.get(`${url}/cards/${id}`);
  return res.data;
};

// POST /cards (logged in)
export const addCard = async (data) => {
  const res = await axios.post(`${url}/cards`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

// PUT /cards/:id (creator, admin)
export const updateCard = async (data) => {
  const res = await axios.put(
    `${url}/cards/${data._id}`,
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

// DELETE /cards/:id (creator, admin)
export const deleteCard = async (data) => {
  const res = await axios.delete(`${url}/cards/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

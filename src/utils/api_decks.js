import axios from "axios";

import { url } from "./data";

// GET /decks
export const getDecks = async (category, creator) => {
  // prev params: category, page, perPage
  // add user for home filter
  const params = {
    //   page,
    //   perPage,
  };
  if (category !== "all") params.category = category; // ?category={category}
  if (creator !== undefined) params.creator = creator;
  // console.log(creator);
  // console.log(params.creator);
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/decks?${query.toString()}`);
  return res.data;
};

// GET /decks/:id
export const getDeck = async (id) => {
  const res = await axios.get(`${url}/decks/${id}`);
  return res.data;
};

// POST /decks (logged in)
export const addDeck = async (data) => {
  const res = await axios.post(`${url}/decks`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

// PUT /decks/:id (creator, admin)
export const updateDeck = async (data) => {
  const res = await axios.put(
    `${url}/decks/${data._id}`,
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

// DELETE /decks/:id (creator, admin)
export const deleteDeck = async (data) => {
  const res = await axios.delete(`${url}/decks/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

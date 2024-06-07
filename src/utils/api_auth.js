import axios from "axios";

import { url } from "./data";

// POST /auth/signup
export const signUpUser = async (data) => {
  const res = await axios.post(`${url}/auth/signup`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// POST /auth/login
export const loginUser = async (data) => {
  const res = await axios.post(`${url}/auth/login`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

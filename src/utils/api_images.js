import axios from "axios";

import { url } from "./data";

// POST /images
export const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await axios.post(`${url}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

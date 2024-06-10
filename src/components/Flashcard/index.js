import { useState } from "react";

import { url } from "../../utils/data";

import ReactCardFlip from "react-card-flip";
import { Card, CardActionArea, CardHeader, CardMedia } from "@mui/material";

export default function Flashcard({ card }) {
  const { fTitle, fDesc, fImage, bTitle, bDesc, bImage } = card;

  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>
      <Card key="front">
        <CardActionArea
          sx={{ minHeight: { sm: "480px", xs: "320px" } }}
          onClick={handleClick}
        >
          <CardHeader
            style={{ textAlign: "center", wordBreak: "break-word" }}
            title={fTitle}
            subheader={fDesc}
          />
          {fImage ? (
            <CardMedia
              sx={{
                maxHeight: { sm: "240px", xs: "160px" },
                width: { sm: "240px", xs: "160px" },
                margin: "auto",
              }}
              image={`${url}/${fImage}`}
              component="img"
              alt="fImage"
            />
          ) : null}
        </CardActionArea>
      </Card>
      <Card key="back">
        <CardActionArea
          sx={{ minHeight: { sm: "480px", xs: "320px" } }}
          onClick={handleClick}
        >
          <CardHeader
            style={{ textAlign: "center", wordBreak: "break-word" }}
            title={bTitle}
            subheader={bDesc}
          />
          {bImage ? (
            <CardMedia
              sx={{
                maxHeight: { sm: "240px", xs: "160px" },
                width: { sm: "240px", xs: "160px" },
                margin: "auto",
              }}
              image={`${url}/${bImage}`}
              component="img"
              alt="fImage"
            />
          ) : null}
        </CardActionArea>
      </Card>
    </ReactCardFlip>
  );
}

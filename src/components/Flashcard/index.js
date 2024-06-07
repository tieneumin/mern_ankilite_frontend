import { useState } from "react";

import ReactCardFlip from "react-card-flip";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { AccountCircle, Close, Info } from "@mui/icons-material";

export default function Flashcard({ card }) {
  const { fTitle, fDesc, fImage, bTitle, bDesc, bImage, category, creator } =
    card;

  //
  console.log(card);
  //

  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <Card key="front">
        <CardActionArea onClick={handleClick}>
          <CardHeader
            title={fTitle}
            subheader={
              <Box display="flex" justifyContent="space-between">
                <Chip
                  size="small"
                  icon={<AccountCircle />}
                  label={
                    <Typography variant="inherit" noWrap>
                      {creator ? creator.username : "-"}
                    </Typography>
                  }
                  style={{ maxWidth: "48%" }}
                />
                <Chip
                  size="small"
                  icon={<Info />}
                  label={
                    <Typography variant="inherit" noWrap>
                      {category ? category.name : "-"}
                    </Typography>
                  }
                  style={{ maxWidth: "48%" }}
                />
              </Box>
            }
            action={
              <IconButton>
                <Close />
              </IconButton>
            }
          />
          {fDesc ? (
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {fDesc}
              </Typography>
            </CardContent>
          ) : null}
          {fImage ? (
            <CardMedia
              component="img"
              image={`http://localhost:1337/${fImage}`}
              alt="fImage"
            />
          ) : null}
        </CardActionArea>
      </Card>
      <Card key="front">
        <CardActionArea onClick={handleClick}>
          <CardHeader
            title={bTitle}
            subheader={
              <Box display="flex" justifyContent="space-between">
                <Chip
                  size="small"
                  icon={<AccountCircle />}
                  label={
                    <Typography variant="inherit" noWrap>
                      {creator ? creator.username : "-"}
                    </Typography>
                  }
                  style={{ maxWidth: "48%" }}
                />
                <Chip
                  size="small"
                  icon={<Info />}
                  label={
                    <Typography variant="inherit" noWrap>
                      {category ? category.name : "-"}
                    </Typography>
                  }
                  style={{ maxWidth: "48%" }}
                />
              </Box>
            }
            action={
              <IconButton>
                <Close />
              </IconButton>
            }
          />
          {bDesc ? (
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {bDesc}
              </Typography>
            </CardContent>
          ) : null}
          {bImage ? (
            <CardMedia
              component="img"
              image={`http://localhost:1337/${bImage}`}
              alt="fImage"
            />
          ) : null}
        </CardActionArea>
      </Card>
    </ReactCardFlip>
  );
}

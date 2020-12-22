import React, { useState } from "react";
import img300 from "../icons/img-not-found-300x450.png";
import img400 from "../icons/img-not-found-400x220.png";

const Image = ({ entry, width, isGameImg }) => {
  const [errorImgs, setErrorImgs] = useState([]);

  const imgError = (id) => {
    setErrorImgs((prevState) => prevState.concat(id));
  };

  let notFoundImgW = img300
  if(isGameImg) {
    notFoundImgW = img400
  }

  return (
    <>
      {!errorImgs.includes(entry.id) ? (
        <img
          alt={entry.title || entry.name}
          src={entry.background_image || "https://image.tmdb.org/t/p/w" + width + entry.poster_path}
          onError={() => imgError(entry.id)}
        />
      ) : (
        <img
          alt={"Image not found for " + entry.title || entry.name}
          src={notFoundImgW}
        />
      )}
    </>
  );
};

export default Image;

import React, { useState } from "react";
import img300 from "../icons/img-not-found-300x450.png";
import img400 from "../icons/img-not-found-400x220.png";
import useLazyLoad from "./useLazyLoad";

const Image = ({ entry, size = {w: 0, h: 0}, wrapperW = 100, isGameImg }) => {
  const [errorImgs, setErrorImgs] = useState([]);
  const { targetRef } = useLazyLoad("0px 0px 100px 0px");

  const imgError = (id) => {
    setErrorImgs((prevState) => prevState.concat(id));
  };

  let notFoundImgW = img300;
  if (isGameImg) {
    notFoundImgW = img400;
  }

  let padding = false;
  if(size) {
    padding = (size.h / size.w) * wrapperW + "%";
  }

  return (
    <div
      className="img-wrapper"
      style={{ paddingBottom: padding ? padding : "100%", width: wrapperW + "%" }}
    >
      {!errorImgs.includes(entry.id) ? (
        <img
          ref={targetRef}
          data-src={
            entry.background_image ||
            "https://image.tmdb.org/t/p/w" + size.w + entry.poster_path
          }
          alt={entry.title || entry.name}
          onError={() => imgError(entry.id)}
        />
      ) : (
        <img
          alt={"Image not found for " + entry.title || entry.name}
          src={notFoundImgW}
        />
      )}
    </div>
  );
};

export default Image;

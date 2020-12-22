import React, { useEffect, useRef, useState } from "react";
import ContentItem from "./ContentItem";
import ContentList from "./ContentList"
import AddDelBtn from "../AddDelBtn";
import ReadMore from "./ReadMore";
import { useDatabase } from "../../context/DatabaseContext";

const DetailsGame = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxImgWidth, setMaxImgWidth] = useState(null);
  const [imgError, setImgError] = useState(false);
  const { details } = useDatabase();
  const imgContainerRef = useRef();
  const imgRef = useRef();

  useEffect(() => {
    const onImgResize = () => {
      if (!imgRef.current) {
        return;
      }
      if (imgRef.current && imgRef.current.offsetHeight < 435) {
        imgContainerRef.current.style.height =
          imgRef.current.offsetHeight + "px";
        imgContainerRef.current.style.marginTop = "0";
        setIsExpanded("dont");
      } else {
        imgContainerRef.current.style.height =
          imgRef.current.offsetHeight * 0.7 + "px";
        imgContainerRef.current.style.marginTop =
          -imgRef.current.offsetHeight * 0.1 + "px";
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", onImgResize);

    const wait = setInterval(() => {
      const img = imgRef.current;
      if (img && img.offsetHeight) {
        clearInterval(wait);
        setMaxImgWidth(img.naturalWidth);
        onImgResize();
      }
    }, 10);

    return () => {
      window.removeEventListener("resize", onImgResize);
    };
  }, []);

  const expandContainer = () => {
    if (isExpanded === "dont") {
      return;
    }
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const onImgError = () => {
    setImgError(true);
  };

  return (
    <div
      className="details-content details-game"
      style={{ maxWidth: maxImgWidth && maxImgWidth + "px" }}
    >
      {!imgError && (
        <>
          <div
            style={{
              height:
                imgRef.current && isExpanded === false
                  ? imgRef.current.offsetHeight * 0.7 + "px"
                  : imgRef.current && imgRef.current.offsetHeight + "px",
              marginTop:
                imgRef.current && isExpanded === false
                  ? -imgRef.current.offsetHeight * 0.1 + "px"
                  : "0",
            }}
            className="img-container"
            ref={imgContainerRef}
            onClick={expandContainer}
          >
            <img
              ref={imgRef}
              alt={details.name}
              src={details.background_image}
              className="details-bg-img"
              onError={onImgError}
            />
            <div className="text-over-image">
              <h1>{details.name}</h1>
              <span>{new Date(details.released).toDateString()}</span>
            </div>
          </div>
          <div className="img-shadow"></div>
        </>
      )}

      {imgError && (
        <div className="text-no-image">
          <h1>{details.name}</h1>
          <span>{new Date(details.released).toDateString()}</span>
        </div>
      )}

      <div className="details-info">
        <div className="info-content">
          <AddDelBtn entry={details} loaderH="40" loaderW="70" isText={true} />
          <div className="content-side">
            <ContentList title="Platforms" list={details.platforms} layer="platforms"/>
            <ContentList title="Genres" list={details.genres}/>
            <ContentList title="Stores" list={details.stores} layer="stores"/>
            <ContentList title="Developers" list={details.developers}/>
            <ContentList title="Publishers" list={details.publishers}/>
            <ContentItem
              title="Metacritic"
              content={
                details.metacritic ? (
                  <a href={details.metacritic_url}>
                    {details.metacritic}
                  </a>
                ) : (
                  "Not available"
                )
              }
            />
            <ContentItem
              title="ESRB rating"
              content={
                details.esrb_rating ? details.esrb_rating.name : "Not available"
              }
            />
          </div>

          <div className="content-main">
            <h2>About</h2>
            <ReadMore description={details.description_raw} maxLength={700} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsGame;

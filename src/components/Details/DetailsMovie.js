import React from "react";
import ContentItem from "./ContentItem"
import ContentList from "./ContentList"
import AddDelBtn from "../AddDelBtn";
import ReadMore from "./ReadMore"
import Image from "../Image"
import { useDatabase } from "../../context/DatabaseContext";

const DetailsMovie = () => {
  const { details } = useDatabase();

  const convertTime = (time) => {
    if (!time) {
      return "unavailable";
    }
    const hours = Math.floor(time / 60);
    const minutes = time - hours * 60;

    if (hours === 0) {
      return time + "min";
    }

    if (minutes === 0) {
      return hours + "h";
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  return (
    <div className="details-content">
      <div className="info-top">
        <Image entry={details} width={300}/>
        <div className="details-title">
          <h1>{details.title} </h1>
          <div>
            <span>{new Date(details.release_date).toDateString()}</span>
          </div>
        </div>
      </div>

      <div className="details-info">
        <div className="info-content">
          <AddDelBtn entry={details} loaderH="40" loaderW="70" isText={true} />
          <div className="content-side">
            <ContentList title="Genres" list={details.genres}/>
            <ContentItem title="Runtime" content={convertTime(details.runtime)}/>
            <ContentItem title="Rating" content={`${details.vote_average}/10 (${details.vote_count})`}/>
            <ContentItem title="Original language" content={details.original_language}/>
          </div>

          <div className="content-main">
            <h2>About</h2>
            <ReadMore description={details.overview} maxLength={300}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsMovie;

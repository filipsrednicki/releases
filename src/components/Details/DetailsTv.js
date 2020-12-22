import React from "react";
import ContentItem from "./ContentItem"
import ContentList from "./ContentList"
import AddDelBtn from "../AddDelBtn";
import ReadMore from "./ReadMore"
import Image from "../Image"
import { useDatabase } from "../../context/DatabaseContext";

const DetailsTv = () => {
  const { details } = useDatabase();

  return (
    <div className="details-content">
      <div className="info-top">
        <Image entry={details} width={300}/>
        <div className="details-title">
          <h1>{details.name} </h1>
          <div>
            <span>
              Next episode - {details.next_episode_to_air ? new Date(details.next_episode_to_air.air_date).toDateString() : "Not available"}
            </span>
          </div>
        </div>
      </div>

      <div className="details-info">
        <div className="info-content">
          <AddDelBtn entry={details} loaderH="40" loaderW="70" isText={true} />
          <div className="content-side">
            <ContentItem title="First air date" content={details.first_air_date}/>
            <ContentList title="Genres" list={details.genres}/>
            <ContentItem title="Episode runtime" content={details.episode_run_time}/>
            <ContentItem title="Rating" content={`${details.vote_average}/10 (${details.vote_count})`}/>
            <ContentList title="Networks" list={details.networks}/>
            <ContentItem title="Original language" content={details.original_language}/>
          </div>

          <div className="content-main">
            <h2>About</h2>
            <ReadMore description={details.overview} maxLength={400}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsTv;

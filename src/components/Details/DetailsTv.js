import React, { useRef, useState } from "react";
import ContentItem from "./ContentItem";
import ContentList from "./ContentList";
import AddDelBtn from "../AddDelBtn";
import ReadMore from "./ReadMore";
import Image from "../Image";
import { useDatabase } from "../../context/DatabaseContext";
import Loader from "react-loader-spinner";

const DetailsTv = () => {
  const { details } = useDatabase();
  const [seasonDetails, setSeasonsDetails] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const episodesListRef = useRef();

  const checkSeasonDetails = (seasonNum) => {
    if (seasonDetails && seasonNum === seasonDetails.season_number) {
      episodesListRef.current.style.minHeight = "";
      return setSeasonsDetails(null);
    }
    setSeasonLoading(true);
    const id = details.id.slice(1, details.id.length);

    fetch(
      "https://api.themoviedb.org/3/tv/" +
        id +
        "/season/" +
        seasonNum +
        "?api_key=" +
        process.env.REACT_APP_TMDB_API_KEY
    )
      .then((res) => res.json())
      .then((result) => {
        setSeasonsDetails(result);
        if (episodesListRef.current) {
          episodesListRef.current.style.minHeight =
            result.episodes.length * 44 + "px";
        }
        setSeasonLoading(false);
      })
      .catch((err) => {
        setSeasonLoading(false);
      });
  };

  const onEpisodeClick = (epId) => {
    if (epId === overview) {
      return setOverview(null);
    }
    setEpisodeLoading(true);
    setOverview(epId);
  };

  return (
    <div className="details-content">
      <div className="info-top">
        <Image entry={details} width={300} />
        <div className="details-title">
          <h1>{details.name} </h1>
          <div>
            <span>
              Next episode -{" "}
              {details.next_episode_to_air
                ? new Date(details.next_episode_to_air.air_date).toDateString()
                : "Not available"}
            </span>
          </div>
        </div>
      </div>

      <div className="details-info">
        <div className="info-content">
          <AddDelBtn entry={details} loaderH="40" loaderW="70" isText={true} />
          <div className="content-side">
            <ContentItem
              title="First air date"
              content={details.first_air_date}
            />
            <ContentList title="Genres" list={details.genres} />
            <ContentItem
              title="Episode runtime"
              content={details.episode_run_time}
            />
            <ContentItem
              title="Rating"
              content={`${details.vote_average}/10 (${details.vote_count})`}
            />
            <ContentList title="Networks" list={details.networks} />
            <ContentItem
              title="Original language"
              content={details.original_language}
            />
          </div>

          <div className="content-main">
            <h2>About</h2>
            <ReadMore description={details.overview} maxLength={400} />
          </div>
        </div>
        <div>
          <h3>Seasons</h3>
          <div className="seasons-container">
            <ul className="seasons-list">
              {details.seasons.map((season) => (
                <li
                  key={season.id}
                  onClick={() => checkSeasonDetails(season.season_number)}
                  className={
                    seasonDetails &&
                    season.season_number === seasonDetails.season_number ?
                    "highlighted" : undefined
                  }
                >
                  <div>
                    <span>{season.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Loader
            type="ThreeDots"
            color="#f0a211"
            visible={seasonLoading}
            height={120}
            width={120}
          />
          <ul className="episodes-list" ref={episodesListRef}>
            {seasonDetails &&
              !seasonLoading &&
              seasonDetails.episodes.map((episode) => (
                <li key={episode.id} onClick={() => onEpisodeClick(episode.id)}>
                  <div>
                    <span className="ep-name">
                      #{episode.episode_number} {episode.name}
                    </span>
                    <span className="ep-date">{episode.air_date}</span>
                  </div>
                  {overview === episode.id && (
                    <div style={{ display: episodeLoading && "none" }}>
                      <img
                        src={
                          "https://image.tmdb.org/t/p/w200" + episode.still_path
                        }
                        onLoad={() => setEpisodeLoading(false)}
                        onError={() => setEpisodeLoading(false)}
                        alt={episode.name}
                      />

                      <p>
                        {episode.overview ||
                          "No description found for this episode."}
                      </p>
                    </div>
                  )}
                </li>
              ))}
          </ul>

          {seasonDetails && (
            <>
              <span
                className="previous-season"
                onClick={() =>
                  checkSeasonDetails(seasonDetails.season_number - 1)
                }
              >
                Previous season
              </span>
              <span
                className="next-season"
                onClick={() =>
                  checkSeasonDetails(seasonDetails.season_number + 1)
                }
              >
                Next season
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsTv;

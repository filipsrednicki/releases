import React, { useRef, useState } from "react";
import ContentItem from "./ContentItem";
import ContentList from "./ContentList";
import AddDelBtn from "../AddDelBtn";
import ReadMore from "./ReadMore";
import Image from "../Image";
import ErrorNotification from "../Errors/ErrorNotification";
import { useDatabase } from "../../context/DatabaseContext";
import Loader from "react-loader-spinner";
import {scroller} from 'react-scroll'

const DetailsTv = () => {
  const { details } = useDatabase();
  const [seasonDetails, setSeasonsDetails] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [seasonError, setSeasonError] = useState(null);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const episodesListRef = useRef();

  const checkSeasonDetails = (seasonNum) => {
    if (seasonDetails && seasonNum === seasonDetails.season_number) {
      episodesListRef.current.style.minHeight = "";
      return setSeasonsDetails(null);
    }
    scroller.scrollTo("seasons", {smooth: true, offset: -120})
    setSeasonLoading(true);
    setOverview(null);
    setSeasonError(null);
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
        setSeasonError(err.message);
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
        <div>
          <Image entry={details} size={{w: 300, h: 450}} />
        </div>
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
          <h3 id="seasons">Seasons</h3>
          <div className="seasons-container">
            <ul className="seasons-list">
              {details.seasons.map((season) => (
                <li
                  key={season.id}
                  onClick={() => checkSeasonDetails(season.season_number)}
                  className={
                    seasonDetails &&
                    season.season_number === seasonDetails.season_number
                      ? "highlighted"
                      : undefined
                  }
                >
                  <div>
                    <span>{season.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {seasonError && 
            <ErrorNotification errMsg={seasonError} />
          }

          <ul className="episodes-list" ref={episodesListRef}>
            {seasonLoading ? (
              <Loader
                type="ThreeDots"
                color="#f0a211"
                height={120}
                width={120}
                className="season-spinner"
              />
            ) : (
              seasonDetails && seasonDetails.episodes.map((episode) => (
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
              ))
            )}
          </ul>

          {seasonDetails && (
            <>
              {(seasonDetails.season_number > 1 ||
                (details.seasons[0].season_number === 0 &&
                  seasonDetails.season_number === 1)) && (
                <span
                  className="previous-season"
                  onClick={() =>
                    checkSeasonDetails(seasonDetails.season_number - 1)
                  }
                >
                  Previous season
                </span>
              )}
              {seasonDetails.season_number !== details.number_of_seasons && (
                <span
                  className="next-season"
                  onClick={() =>
                    checkSeasonDetails(seasonDetails.season_number + 1)
                  }
                >
                  Next season
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsTv;

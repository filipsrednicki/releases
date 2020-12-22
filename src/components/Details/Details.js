import React, { useEffect } from "react";
import DetailsTv from "./DetailsTv";
import DetailsMovie from "./DetailsMovie";
import DetailsGame from "./DetailsGame";
import ErrorNotification from "../ErrorNotification";
import { useParams } from "react-router-dom";
import { useDatabase } from "../../context/DatabaseContext";
import Loader from "react-loader-spinner";
import "./Details.css";

const Details = () => {
  let { id } = useParams();
  const { details, checkDetails, error, notFound } = useDatabase();

  useEffect(() => {
    if (details) {
      if (id === details.id) {
        return;
      }
      checkDetails(id);
    } else {
      checkDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="details">
      {error ? (
        <ErrorNotification errMsg={error} />
      ) : typeof details === "object" ? (
        details.id[0] === "g" ? (
          <DetailsGame />
        ) : details.id[0] === "t" ? (
          <DetailsTv />
        ) : (
          details.id[0] === "m" && <DetailsMovie />
        )
      ) : notFound ? (
        <ErrorNotification content={
          <>
            <h3>404 Not Found</h3>
            <p>{notFound}</p>
          </>
        }/>
      ) : (
        <Loader type="ThreeDots" color="#f0a211" height={120} width={120} />
      )}
    </div>
  );
}

export default Details;

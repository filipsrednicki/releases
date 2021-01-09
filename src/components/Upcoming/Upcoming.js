import React, { useEffect, useRef, useState } from "react";
import UpcomingEntries from "./UpcomingEntries";
import Categories from "../Categories";
import ErrorNotification from "../Errors/ErrorNotification";
import Loader from "react-loader-spinner";
import "./Upcoming.css";

const Upcoming = () => {
  const [currentCategory, setCurrentCategory] = useState("movie");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const heading = useRef();
  const upcomingHead = useRef();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const dateNow = new Date();
    const dateString = dateNow.toISOString();
    const startDateStr = dateString.slice(0, 10);
    let startDay = dateNow.getDate();
    let endDay = startDay;

    if (startDay > 28) {
      const numOfDays = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth() + 2,
        0
      ).getDate();
      if (startDay >= numOfDays) {
        endDay = numOfDays;
      } else {
        endDay = startDay;
      }
    }

    let end;
    switch (dateNow.getMonth()) {
      case 11:
        end = {
          year: dateNow.getFullYear() + 1,
          month: 1,
          day: endDay + 1
        };
        break;
      case 10:
        end = {
          year: dateNow.getFullYear() + 1,
          month: 0,
          day: endDay + 1
        };
        break;
      default:
        end = {
          year: dateNow.getFullYear(),
          month: dateNow.getMonth() + 2,
          day: endDay + 1
        }
    }

    const endDateStr = new Date(end.year, end.month, end.day).toISOString().slice(0, 10)

    let url = "";
    if (currentCategory === "movie") {
      url =
        "https://api.themoviedb.org/3/discover/movie?api_key=ed2ca9087d4e3767429d08b8876aac06&primary_release_date.gte="+ startDateStr + "&primary_release_date.lte=" + endDateStr;
      heading.current.style.color = "#FFF";
      upcomingHead.current.style.borderColor = "#7e2bd1";
    } else if (currentCategory === "tv") {
      url =
        "https://api.themoviedb.org/3/discover/tv?api_key=ed2ca9087d4e3767429d08b8876aac06&air_date.gte=" +
        startDateStr +
        "&air_date.lte=" +
        endDateStr;
      heading.current.style.color = "#FFF";
      upcomingHead.current.style.borderColor = "#ab5200";
    } else {
      url =
        "https://api.rawg.io/api/games?dates=" +
        startDateStr +
        "," +
        endDateStr +
        "&ordering=-added&page_size=12";
      heading.current.style.color = "#FFF";
      upcomingHead.current.style.borderColor = "#2b82d9";
    }

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (currentCategory === "tv") {
          let showsDetails = [];
          result.results.forEach((item, i) => {
            fetch(
              "https://api.themoviedb.org/3/tv/" +
                item.id +
                "?api_key=ed2ca9087d4e3767429d08b8876aac06"
            )
              .then((res) => res.json())
              .then((result) => {
                result.id = "t" + result.id;
                showsDetails.push(result);
                if (showsDetails.length === 20) {
                  setUpcomingShows(showsDetails);
                  setIsLoading(false);
                }
              })
              .catch((error) => {
                setError(error.message);
                setIsLoading(false);
              });
          });
        } else {
          if (currentCategory === "movie") {
            result.results.forEach((item) => {
              item.id = "m" + item.id;
            });
            setUpcomingMovies(result.results);
          } else {
            result.results.forEach((item) => {
              item.id = "g" + item.id;
            });
            setUpcomingGames(result.results);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [currentCategory]);

  return (
    <div className="upcoming-container">
      <div ref={upcomingHead} className="upcoming-head">
        <h2 ref={heading}>Top Upcoming</h2>
        <Categories name="upcoming-" chooseCategory={setCurrentCategory} />
      </div>
      <div>
        {error && <ErrorNotification errMsg={error} />}

        {isLoading && (
          <Loader type="ThreeDots" color="#f0a211" height={120} width={120} />
        )}

        {!isLoading && (
          currentCategory === "movie" ? (
            <UpcomingEntries type="movies" upcoming={upcomingMovies}/>
          ) : currentCategory === "tv" ? (
            <UpcomingEntries type="shows" upcoming={upcomingShows}/>
          ) : (
            <UpcomingEntries type="games" upcoming={upcomingGames}/>
          )
        )}
      </div>
    </div>
  );
};

export default Upcoming;

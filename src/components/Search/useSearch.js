import { useState } from "react";
import { useHistory } from "react-router-dom";

const useSearch = (category, pageSize = 5) => {
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const history = useHistory();

  const searchByTitle = (query, pageNum = 1) => {
    setError(null);
    setLoadingResults(true);

    if (history.location.pathname.includes("/search")) {
      history.push({
        pathname: `/search/${category}`,
        search: "?query=" + query,
      });
    }

    let url = "";
    if (category === "game") {
      url = `https://api.rawg.io/api/games?page_size=${pageSize}&page=${pageNum}&search=${query}`;
    } else {
      url = `https://api.themoviedb.org/3/search/${category}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&page=${pageNum}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (result.results.length === 0) {
          setNoResults(true);
          setLoadingResults(false);
        } else {
          setNoResults(false);
          if (category === "tv") {
            unifyResults(result, "t");
          } else if (category === "game") {
            unifyResults(result, "g");
          } else {
            unifyResults(result, "m");
          }
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoadingResults(false);
      });
  };

  const unifyResults = (result, prefix) => {
    let resultsCopy = result.results.slice(0, pageSize);

    if (prefix !== "g") {
      resultsCopy = resultsCopy.map((result) => {
        if (prefix === "m") {
          const { title: name, release_date: released, ...rest } = result;
          return { name, released, ...rest };
        } else {
          const { first_air_date: released, ...rest } = result;
          return { released, ...rest };
        }
      });
    }

    resultsCopy.forEach((item) => {
      item.id = prefix + item.id;
      if (prefix === "g") {
        if (item.platforms === null) {
          item.platforms = [];
        } else {
          let platformsString = [];
          item.platforms.slice(0, 3).forEach((platform) => {
            platformsString.push(platform.platform.name);
          });
          item.platforms = platformsString;
        }
      }
      if (prefix === "t") {
        item.released = item.released.slice(0, 4);
      }
    });

    resultsCopy.maxPages = result.total_pages
      ? result.total_pages
      : Math.round(result.count / 20);
    setResults(resultsCopy);
    setLoadingResults(false);
  };

  return {
    searchByTitle,
    results,
    setResults,
    noResults,
    setNoResults,
    error,
    setError,
    loadingResults,
  };
};

export default useSearch;

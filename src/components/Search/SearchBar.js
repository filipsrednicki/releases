import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";

const SearchBar = ({
  setAdvSearchQuery,
  setIsListDisplayed,
  setResults,
  category,
  setNoResults,
  setError,
  urlQuery
}) => {
  const [query, setQuery] = useState("");
  const [loadingResults, setLoadingResults] = useState(false);
  const history = useHistory()

  const isList = (bool) => {
    if (!setIsListDisplayed) return;
    setIsListDisplayed(bool);
  };

  const updateQuery = (queryStr) => {
    setQuery(queryStr);
    setAdvSearchQuery && setAdvSearchQuery(queryStr);
    setNoResults(false);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
    setError(null);
  };

  const searchByTitle = (key, passedQuery) => {
    setError(null);
    const finalQuery = passedQuery || query
    if (finalQuery && key === "Enter") {
      setLoadingResults(true);
      if(history.location.pathname.includes("/search")) {
        history.push({
          pathname: `/search/${category}`,
          search: "?query=" + finalQuery
        })
      }
      let url = "";

      if (category === "game") {
        url = "https://api.rawg.io/api/games?page_size=5&search=" + finalQuery;
      } else {
        url =
          "https://api.themoviedb.org/3/search/" +
          category +
          "?api_key=" +
          process.env.REACT_APP_TMDB_API_KEY +
          "&query=" +
          finalQuery;
      }

      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          if (result.results.length === 0) {
            setNoResults(true);
            setLoadingResults(false);
            isList(true);
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
          isList(true);
        });
    } else {
      setResults([]);
      isList(false);
    }
  };

  const unifyResults = (result, prefix) => {
    let resultsCopy = result.results.slice(0, 5);

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

    resultsCopy.forEach((item, i) => {
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

    setResults(resultsCopy);
    setLoadingResults(false);
    isList(true);
  };

  useEffect(() => {
    if(urlQuery) {
      console.log(decodeURIComponent(urlQuery))
      searchByTitle("Enter", urlQuery)
      setQuery(decodeURIComponent(urlQuery))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery])

  return (
    <div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        onKeyDown={(e) => searchByTitle(e.key)}
        {...(setIsListDisplayed && { 
          onClick: () => setIsListDisplayed(true) 
        })}
        disabled={loadingResults}
      />

      {loadingResults && (
        <span className="loading-results">
          <Loader type="ThreeDots" color="#f0a211" height={36} width={70} />
        </span>
      )}

      {query && !loadingResults && (
        <span className="btn-clear" onClick={clearQuery}>
          <i className="fas fa-times"></i>
        </span>
      )}
    </div>
  );
};

export default SearchBar;

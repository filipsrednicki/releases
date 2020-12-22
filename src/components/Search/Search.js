import React, { useRef, useState } from "react";
import Categories from "../Categories";
import SearchResult from "./SearchResult";
import "./Search.css";
import Loader from "react-loader-spinner";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  const [isCategories, setIsCategories] = useState(false);
  const [isListDisplayed, setIsListDisplayed] = useState(false);

  const category = useRef("movie");

  const updateQuery = (queryStr) => {
    setQuery(queryStr);
    if (noResults) {
      setNoResults(false);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
    setError(null);
  };

  const searchByTitle = (key) => {
    setError(null);
    if (query && key === "Enter") {
      setLoadingResults(true);
      let url = "";

      if (category.current === "game") {
        url =
          "https://api.rawg.io/api/games?page_size=5&search=" +
          query
      } else {
        url =
          "https://api.themoviedb.org/3/search/" +
          category.current +
          "?api_key="+ process.env.REACT_APP_TMDB_API_KEY + "&query=" +
          query;
      }

      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          if (result.results.length === 0) {
            setNoResults(true);
            setLoadingResults(false);
            setIsListDisplayed(true);
          } else {
            setNoResults(false);
            if (category.current === "tv") {
              unifyResults(result, "t");
            } else if (category.current === "game") {
              unifyResults(result, "g");
            } else {
              unifyResults(result, "m");
            }
          }
        })
        .catch((error) => {
          setError(error.message);
          setLoadingResults(false);
          setIsListDisplayed(true);
        });
    } else {
      setResults([]);
      setIsListDisplayed(false);
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
    setIsListDisplayed(true);
  };

  const chooseCategory = (cat) => {
    setNoResults(false);
    category.current = cat;
    if (query) {
      searchByTitle("Enter");
    }
    if (results.length > 0) {
      setResults([]);
    }
  };

  const onShowCategories = () => {
    setIsCategories(!isCategories);
  };

  return (
    <div className="search-container">
      <div>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onKeyDown={(e) => searchByTitle(e.key)}
          onClick={() => setIsListDisplayed(true)}
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

      <span
        className="show-categories"
        onClick={onShowCategories}
        style={{ top: isCategories ? "38px" : "0" }}
      >
        Categories
      </span>

      <Categories
        isCategories={isCategories}
        chooseCategory={chooseCategory}
        name="search-"
        styles={{
          top: isCategories ? "-20px" : "-60px",
          borderRadius: !isCategories && "12px",
        }}
      />

      {isListDisplayed && (noResults || results.length > 0 || error) && (
        <SearchResult
          setIsListDisplayed={setIsListDisplayed}
          results={results}
          category={category}
          isCategories={isCategories}
          query={query}
          noResults={noResults}
          error={error}
        />
      )}
    </div>
  );
};

export default Search;

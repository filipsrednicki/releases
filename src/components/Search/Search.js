import React, { useRef, useState } from "react";
import Categories from "../Categories";
import SearchResult from "./SearchResult";
import SearchError from "./SearchError";
import "./Search.css";
import Loader from "react-loader-spinner";
import useDropdown from "../Dropdown/useDropdown";
import Dropdown from "../Dropdown/Dropdown";
import DropdownItem from "../Dropdown/DropdownItem";
import AddDelBtn from "../AddDelBtn";
import { useDatabase } from "../../context/DatabaseContext";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  const [isCategories, setIsCategories] = useState(false);

  const category = useRef("movie");

  const searchResults = useRef();
  const { checkDetails } = useDatabase();
  const classes = ["search-bar", "categories", "show-categories"];
  const [showDropdown, setShowDropdown] = useDropdown(searchResults, classes);

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
        url = "https://api.rawg.io/api/games?page_size=5&search=" + query;
      } else {
        url =
          "https://api.themoviedb.org/3/search/" +
          category.current +
          "?api_key=" +
          process.env.REACT_APP_TMDB_API_KEY +
          "&query=" +
          query;
      }

      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          if (result.results.length === 0) {
            setNoResults(true);
            setLoadingResults(false);
            setShowDropdown(true);
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
        });
    } else {
      setResults([]);
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

  const hideDropdown = (id) => {
    checkDetails(id);
    setShowDropdown(false);
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
          onClick={() => setShowDropdown(true)}
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
        chooseCategory={chooseCategory}
        name="search-"
        styles={{
          top: isCategories ? "-20px" : "-60px",
          borderRadius: !isCategories && "12px",
        }}
      />

      <SearchError
        visible={showDropdown && noResults}
        isCategories={isCategories}
        searchRef={searchResults}
      >
        No results found for "{query}".
      </SearchError>

      <SearchError
        visible={showDropdown && error}
        isCategories={isCategories}
        searchRef={searchResults}
      >
        <h4>Oops! Something went wrong.</h4>
        Error message: {error}
      </SearchError>

      <Dropdown
        el="ul"
        name="search"
        dropdownRef={searchResults}
        showDropdown={showDropdown && results.length > 0}
        styles={{
          top: isCategories ? "-30px" : "-70px",
          paddingTop: isCategories ? "9px" : "9px",
        }}
      >
        {results.map((result) => (
          <li className="search" key={result.id}>
            <DropdownItem
              path={`/details/${result.id}`}
              name="details-link"
              handleClick={() => hideDropdown(result.id)}
            >
              <SearchResult result={result} category={category.current} />
            </DropdownItem>
            <div className="buttons">
              <AddDelBtn entry={result} loaderH="40" loaderW="40" />
            </div>
          </li>
        ))}
      </Dropdown>
    </div>
  );
};

export default Search;

import React, { useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import SearchError from "./SearchError";
import useSearch from "./useSearch";
import Categories from "../Categories";
import DropdownItem from "../Dropdown/DropdownItem";
import AddDelBtn from "../AddDelBtn";
import { useDatabase } from "../../context/DatabaseContext";
import { useHistory, useLocation, useParams } from "react-router-dom";

const AdvSearch = () => {
  const { checkDetails } = useDatabase();
  const location = useLocation();
  const params = useParams();
  const history = useHistory();
  const category = useRef(params.category || "movie");
  
  const {
    results,
    setResults,
    noResults,
    setNoResults,
    error,
    setError,
    searchByTitle,
    loadingResults,
  } = useSearch(category.current);

  const chooseCategory = (cat) => {
    setNoResults(false);
    setError(null);
    history.push({
      pathname: `/search/${cat}`,
      search: location.search,
    });
    category.current = cat;
    if (results.length > 0) {
      setResults([]);
    }
  };

  useEffect(() => {
    if (
      location.search.length > 7 &&
      location.search.slice(0, 7) === "?query="
    ) {
      searchByTitle(location.search.slice(7, location.search.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="more-results">
      <SearchBar
        setResults={setResults}
        setNoResults={setNoResults}
        setError={setError}
        {...(location.search.slice(0, 7) === "?query=" && {
          urlQuery: location.search.slice(7, location.search.length),
        })}
        searchByTitle={searchByTitle}
        loadingResults={loadingResults}
      />

      <Categories
        chooseCategory={chooseCategory}
        name="adv-search-"
        checked={category.current}
      />

      <SearchError visible={noResults}>No results found.</SearchError>

      <SearchError visible={error}>
        <h4>Oops! Something went wrong.</h4>
        Error message: {error}
      </SearchError>

      <ul className="adv-search">
        {results.map((result) => (
          <li className="adv-search" key={result.id}>
            <DropdownItem
              path={`/details/${result.id}`}
              name="details-link"
              handleClick={() => checkDetails(result.id)}
            >
              <SearchResult result={result} category={category.current} />
            </DropdownItem>
            <div className="buttons">
              <AddDelBtn entry={result} loaderH="40" loaderW="40" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvSearch;

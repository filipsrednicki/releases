import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import SearchError from "./SearchError";
import useSearch from "./useSearch";
import Categories from "../Categories";
import DropdownItem from "../Dropdown/DropdownItem";
import AddDelBtn from "../AddDelBtn";
import { useDatabase } from "../../context/DatabaseContext";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./Search.css";

const AdvSearch = () => {
  const [pageNum, setPageNum] = useState(1);
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
  } = useSearch(category.current, 20);

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
      setPageNum(1);
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

  const prevPage = () => {
    searchByTitle(
      location.search.slice(7, location.search.length),
      pageNum - 1
    );
    setPageNum((num) => num - 1);
  };

  const nextPage = () => {
    searchByTitle(
      location.search.slice(7, location.search.length),
      pageNum + 1
    );
    setPageNum((num) => num + 1);
  };

  let bColor = "#7e2bd1"
  if(category.current === "tv") {
    bColor = "#ab5200"
  } else if (category.current === "game") {
    bColor = "#2b82d9"
  }

  return (
    <div className="more-results">
      <div style={{ borderColor: bColor }}>
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
      </div>

      <SearchError visible={noResults}>No results found.</SearchError>

      <SearchError visible={error}>
        <h4>Oops! Something went wrong.</h4>
        Error message: {error}
      </SearchError>

      <ul className="search">
        {results.map((result) => (
          <li className="search" key={result.id}>
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
      {pageNum !== 1 && (
        <span className="previous-page" onClick={prevPage}>
          Previous page
        </span>
      )}
      {results.length > 0 && pageNum < results.maxPages && (
        <span className="next-page" onClick={nextPage}>
          Next page
        </span>
      )}
    </div>
  );
};

export default AdvSearch;

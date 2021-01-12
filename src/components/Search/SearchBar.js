import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";

const SearchBar = ({
  setAdvSearchQuery,
  setIsListDisplayed,
  setResults,
  setNoResults,
  setError,
  urlQuery,
  loadingResults,
  searchByTitle
}) => {
  const [query, setQuery] = useState("");

  const updateQuery = (queryStr) => {
    setQuery(queryStr);
    setAdvSearchQuery && setAdvSearchQuery(queryStr);
    setNoResults(false);
    if (!queryStr) {
      setResults([])
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
    setError(null);
  };

  useEffect(() => {
    if (urlQuery) {
      setQuery(decodeURIComponent(urlQuery));
    }
  }, [urlQuery]);

  const isKeyDownEnter = (key) => {
    if(key === "Enter" && query) {
      searchByTitle(query)
    }
  }

  return (
    <div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        onKeyDown={(e) => isKeyDownEnter(e.key)}
        {...(setIsListDisplayed && {
          onClick: () => setIsListDisplayed(true),
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

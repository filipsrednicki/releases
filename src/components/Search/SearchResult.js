import React, { useEffect, useRef } from "react";
import AddDelBtn from "../AddDelBtn";
import Image from "../Image"
import { Link } from "react-router-dom";
import { useDatabase } from "../../context/DatabaseContext";

const SearchResult = (props) => {
  const { checkDetails } = useDatabase();
  const searchResults = useRef();

  useEffect(() => {
    const hideSearchResults = (e) => {
      if (
        searchResults.current.contains(e.target) ||
        e.target.className === "search-bar" ||
        e.target.className === "categories" ||
        e.target.className === "show-categories"
      ) {
        return;
      }
      props.setIsListDisplayed(false);
    };
    
    document.addEventListener("mousedown", hideSearchResults);
    return () => {
      document.removeEventListener("mousedown", hideSearchResults);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul
      className="search"
      ref={searchResults}
      style={{
        top: props.isCategories ? "-30px" : "-70px",
        paddingTop: props.isCategories ? "9px" : "9px",
      }}
    >
      {props.noResults && props.query && (
        <span className="no-results-msg">
          No results found for "{props.query}".
        </span>
      )}
      {props.error && props.query && (
        <span className="search-error-msg">
          <h4>Oops! Something went wrong.</h4>
          Error message: {props.error}
        </span>
      )}
      {props.results.map((result, i) => (
        <li className="search" key={result.id}>
          <Link
            to={`/details/${result.id}`}
            className="details-link"
            onClick={() => checkDetails(result.id)}
          >
            <div className="search-result">
              {props.category.current !== "game" && (
                <Image entry={result} width={200}/>
              )}
              <div
                style={{
                  gridColumn: props.category.current === "game" && "1 / 3",
                }}
              >
                {result.name} ({result.released})
                {props.category.current === "game" && (
                  <div className="platforms-search">
                    {result.platforms.join(" | ")}
                  </div>
                )}
              </div>
            </div>
          </Link>
          <div className="buttons">
            <AddDelBtn entry={result} loaderH="40" loaderW="40"/>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SearchResult;

import React, { useRef, useState } from "react";
import Categories from "../Categories";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import SearchError from "./SearchError";
import "./Search.css";
import useDropdown from "../Dropdown/useDropdown";
import Dropdown from "../Dropdown/Dropdown";
import DropdownItem from "../Dropdown/DropdownItem";
import AddDelBtn from "../AddDelBtn";
import { useDatabase } from "../../context/DatabaseContext";

const Search = () => {
  const [advSearchQuery, setAdvSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  const [isCategories, setIsCategories] = useState(false);
  const category = useRef("movie");
  const { checkDetails } = useDatabase();

  const searchResults = useRef();
  const classes = ["search-bar", "categories", "show-categories"];
  const [showDropdown, setShowDropdown] = useDropdown(searchResults, classes);

  const chooseCategory = (cat) => {
    setNoResults(false);
    category.current = cat;
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
      <SearchBar
        setAdvSearchQuery={setAdvSearchQuery}
        setResults={setResults}
        setIsListDisplayed={setShowDropdown}
        category={category.current}
        setNoResults={setNoResults}
        setError={setError}
      />

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
        No results found.
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
        <DropdownItem
          path={`/search/${category.current}?query=${advSearchQuery}`}
          handleClick={() => setShowDropdown(false)}
        >
          More results
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export default Search;

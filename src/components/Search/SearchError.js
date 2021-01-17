import React from "react";

const SearchError = ({ visible, isCategories, searchRef, children }) => {
  if (!visible) {
    return null;
  }
  return (
    <div
      className="search"
      ref={searchRef}
      style={isCategories !== null && {
        top: isCategories ? "-30px" : "-70px",
        paddingTop: isCategories ? "9px" : "9px",
      }}
    >
      <span className="search-error-msg">{children}</span>
    </div>
  );
};

export default SearchError;

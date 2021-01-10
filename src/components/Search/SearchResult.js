import React from "react";
import Image from "../Image";

const SearchResult = ({ result, category }) => {
  return (
    <div className="search-result">
      {category !== "game" && <Image entry={result} width={200} />}
      <div
        style={{
          gridColumn: category === "game" && "1 / 3",
        }}
      >
        {result.name} ({result.released})
        {category === "game" && (
          <div className="platforms-search">{result.platforms.join(" | ")}</div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;

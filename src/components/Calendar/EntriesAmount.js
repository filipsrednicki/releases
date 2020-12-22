import React from "react";

const EntriesAmount = ({ entries }) => {
  return (
    <div className="entries-amount">
      {entries.games > 0 && (
        <span className="games-amount">
            {entries.games}
        </span>
      )}
      {entries.tvShows > 0 && (
        <span className="tv-amount">
            {entries.tvShows}
        </span>
      )}
      {entries.movies > 0 && (
        <span className="movies-amount">
            {entries.movies}
        </span>
      )}
    </div>
  );
};

export default EntriesAmount;

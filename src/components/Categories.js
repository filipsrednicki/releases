import React from "react";

const Categories = ({ name, chooseCategory, styles }) => {
  return (
    <div
      className={"categories " + name + "categories"}
      style={styles}
    >
      <input
        type="radio"
        id={name + "movies"}
        name={name + "categories"}
        value="movie"
        defaultChecked
        onChange={(e) => chooseCategory(e.target.value)}
      />
      <label className="movies-label label-container" htmlFor={name + "movies"}>
        <span>Movies</span>
      </label>

      <input
        type="radio"
        id={name + "tv"}
        name={name + "categories"}
        value="tv"
        onChange={(e) => chooseCategory(e.target.value)}
      />
      <label className="tv-label label-container" htmlFor={name + "tv"}>
        <span>TV Shows</span>
      </label>

      <input
        type="radio"
        id={name + "games"}
        name={name + "categories"}
        value="game"
        onChange={(e) => chooseCategory(e.target.value)}
      />
      <label className="games-label label-container" htmlFor={name + "games"}>
        <span>Games</span>
      </label>
    </div>
  );
};

export default Categories;
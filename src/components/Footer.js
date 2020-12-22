import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="attribution">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={require("../icons/tmdb.svg")} alt="TMDB logo" />
          <p>
            This product uses the TMDb API but is not endorsed or certified by
            TMDb.
          </p>
        </a>
        <div className="vertical-line"></div>
        <a href="https://rawg.io/" target="_blank" rel="noopener noreferrer">
          <h1>RAWG</h1>
          <p>Data for games provided by RAWG API.</p>
        </a>
      </div>
        <p>&#169; 2020 Filip Średnicki</p>
    </footer>
  );
};

export default Footer;

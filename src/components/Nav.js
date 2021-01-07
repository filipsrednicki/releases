import React, { useRef } from "react";
import { NavLink, Route } from "react-router-dom";
import Search from "./Search/Search";

import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../context/DatabaseContext";

const Nav = () => {
  const calendarNav = useRef();
  const upcomingNav = useRef();
  const { user, logOut, setAuthMode } = useAuth();
  const { setList } = useDatabase();

  const handleLogOut = () => {
    logOut();
    setList([]);
  };

  return (
    <nav className="navbar">
      <div className="navlinks">
        <NavLink
          exact
          to="/"
          className="navlink"
          activeClassName="current-page"
          ref={upcomingNav}
        >
          Upcoming
        </NavLink>

        {user && (
          <NavLink
            to="/calendar"
            className="navlink"
            activeClassName="current-page"
            ref={calendarNav}
          >
            Calendar
          </NavLink>
        )}
      </div>

      <Route path="/" component={Search} />

      <div className="btn-container">
        {user ? (
          <button className="btn-logout" onClick={handleLogOut} title="Log Out">
            <span>Log Out</span>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        ) : (
          <>
            <button
              className="btn-auth"
              onClick={() => setAuthMode("login")}
              title="Log In"
            >
              <span>Log In</span>
              <i className="fas fa-sign-in-alt"></i>
            </button>
            <button
              className="btn-auth"
              onClick={() => setAuthMode("signup")}
              title="Sign Up"
            >
              <span>Sign Up</span>
              <i className="fas fa-user-plus"></i>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;

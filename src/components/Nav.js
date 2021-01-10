import React, { useRef } from "react";
import { NavLink, Route } from "react-router-dom";
import Search from "./Search/Search";
import Dropdown from "./Dropdown/Dropdown";
import DropdownItem from "./Dropdown/DropdownItem";

import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../context/DatabaseContext";
import useDropdown from "./Dropdown/useDropdown"

const Nav = () => {
  const calendarNav = useRef();
  const upcomingNav = useRef();
  const { user, logOut, setAuthMode } = useAuth();
  const { setList } = useDatabase();
  
  const dropdownRef = useRef();
  const classes = ["dropdown-toggle"]
  const [showDropdown, setShowDropdown] = useDropdown(dropdownRef, classes)

  const handleLogOut = () => {
    logOut();
    setList([]);
    setShowDropdown(false);
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
          <>
            <i
              className="fas fa-user dropdown-toggle"
              onClick={() => setShowDropdown((prevstate) => !prevstate)}
            ></i>
            <Dropdown el="div" dropdownRef={dropdownRef} showDropdown={showDropdown}>
              <DropdownItem path="/settings" handleClick={() => setShowDropdown(false)}>
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem handleClick={handleLogOut}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Log Out</span>
              </DropdownItem>
            </Dropdown>
          </>
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

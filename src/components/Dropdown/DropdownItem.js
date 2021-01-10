import React from "react";
import { Link } from "react-router-dom";

const DropdownItem = ({ children, path, handleClick, name }) => {
  const CustomTag = path ? Link : "div";
  return (
    <CustomTag
      to={path}
      className={name ? name : "dropdown-item"}
      onClick={handleClick}
    >
      {children}
    </CustomTag>
  );
};

export default DropdownItem;

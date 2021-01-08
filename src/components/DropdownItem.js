import React from "react";
import { Link } from "react-router-dom";

const DropdownItem = ({children, type, path, buttonClick, hideDropdown}) => {
  return (
      <>
        {type === "link" && 
            <Link to={path} className="dropdown-item" onClick={() => hideDropdown(false)}>
                {children}
            </Link>
        }
        {type === "button" && 
            <div className="dropdown-item" onClick={buttonClick}>
                {children}
            </div>
        }
      </>
  );
};

export default DropdownItem;

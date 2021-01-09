import React, { useEffect, useRef } from "react";

const Dropdown = ({ children, showDropdown, setShowDropdown }) => {
  const dropdownRef = useRef();

  useEffect(() => {
    if(!showDropdown) {
      return
    }
    const hideDropdown = (e) => {
      if (
        dropdownRef.current.contains(e.target) ||
        e.target.classList.contains("dropdown-toggle")
      ) {
        return;
      }
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", hideDropdown);

    return () => {
      document.removeEventListener("mousedown", hideDropdown);
    };
  }, [showDropdown, setShowDropdown]);

  return (
    <>
      {showDropdown && 
        <div className="dropdown" ref={dropdownRef}>
          {children}
        </div>
      }
    </>
  );
};

export default Dropdown;

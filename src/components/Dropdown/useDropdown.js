import { useEffect, useState } from "react";

const useDropdown = (dropdownRef, classes) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!showDropdown) {
      return;
    }
    const hideDropdown = (e) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        return;
      }

      let quit = false
      classes.forEach((name) => {
        if (e.target.className.includes(name)) {
          return quit = true;
        }
      });
      if (quit) return
      
      setShowDropdown(false);
    };
    
    const hideOnEscape = (e) => {
      if(e.key === "Escape") {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", hideDropdown);
    document.addEventListener("keydown", hideOnEscape);

    return () => {
      document.removeEventListener("mousedown", hideDropdown);
      document.removeEventListener("keydown", hideOnEscape);
    };
  }, [showDropdown, setShowDropdown, dropdownRef, classes]);

  return [showDropdown, setShowDropdown];
};

export default useDropdown;

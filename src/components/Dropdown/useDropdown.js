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
    document.addEventListener("mousedown", hideDropdown);

    return () => {
      document.removeEventListener("mousedown", hideDropdown);
    };
  }, [showDropdown, setShowDropdown, dropdownRef, classes]);

  return [showDropdown, setShowDropdown];
};

export default useDropdown;

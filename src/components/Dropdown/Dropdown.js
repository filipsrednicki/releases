import React from "react";

const Dropdown = ({
  children,
  showDropdown,
  dropdownRef,
  el,
  name,
  styles,
}) => {
  if (!showDropdown) {
    return null;
  }

  const CustomTag = el;
  return (
    <CustomTag
      className={name ? name : "dropdown"}
      ref={dropdownRef}
      style={styles}
    >
      {children}
    </CustomTag>
  );
};

export default Dropdown;

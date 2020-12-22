import React from "react";

const ContentItem = ({ title, content }) => {
  return (
    <div>
      <strong>{title}: </strong>
      <span>{content}</span>
    </div>
  );
};

export default ContentItem;

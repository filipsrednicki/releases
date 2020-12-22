import React from "react";

const ContentList = ({ title, list, layer }) => {
  const isLayered = (item) => {
    if (layer === "platforms") {
      return <li key={item.platform.id}>{item.platform.name} </li>;
    } else if (layer === "stores") {
      return (
        <li key={item.store.id}>
          <a href={item.url}>{item.store.name}</a>
        </li>
      );
    }
  };

  return (
    <div>
      <strong>{title}</strong>
      <ul className="details-list">
        {list.map((item) =>
          layer ? isLayered(item) : <li key={item.id}>{item.name} </li>
        )}
      </ul>
    </div>
  );
};

export default ContentList;

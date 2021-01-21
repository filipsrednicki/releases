import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useDatabase } from "../../context/DatabaseContext";

const ContentEntry = memo(({ entry }) => {
  const { setDeleteEntry } = useDatabase();

  return (
    <div
      className={`day-content ${entry.id[0]}-content`}
      key={entry.epId ? entry.epId : entry.id}
    >
      <Link to={`/details/${entry.id}`} className="details-link">
        <h4>{entry.name}</h4>
        <span>{entry.epNum}</span>
        <span>{entry.genres}</span>
      </Link>

      <button
        className="btn-del-calendar"
        onClick={() => setDeleteEntry(entry)}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
});

export default ContentEntry;

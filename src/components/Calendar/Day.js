import React, { memo, useEffect, useState } from "react";
import EntriesAmount from "./EntriesAmount";
import { Link } from "react-router-dom";
import { useDatabase } from "../../context/DatabaseContext";

const Day = memo(
  ({ day, i, monthInfo, isInAllDays, addToAllDays, removeFromAllDays }) => {
    const [isDayOpen, setIsDayOpen] = useState(false);
    const { setDeleteEntry } = useDatabase();

    useEffect(() => {
      if (!isInAllDays) {
        setIsDayOpen(false);
      }
    }, [isInAllDays]);

    const checkDayContent = (i, content) => {
      if (content.length) {
        if (addToAllDays) {
          if (isInAllDays) {
            removeFromAllDays(i);
          } else {
            addToAllDays(i);
          }
        }
        setIsDayOpen((open) => !open);
      }
    };

    const shouldOpen = (isDayOpen || isInAllDays) && day.content.length > 0;
    const firstDayColStart =
      monthInfo && i === 0
        ? monthInfo.firstDayOfMonth === 0
          ? 7
          : monthInfo.firstDayOfMonth
        : "";

    return (
      <div className="day" style={{ gridColumnStart: firstDayColStart }}>
        <span
          className="day-title"
          onClick={() => checkDayContent(i, day.content)}
          style={{
            color: day.current ? "#F1C40F" : "",
            borderRadius: shouldOpen ? "12px 12px 0 0" : "12px",
            backgroundColor: shouldOpen ? "#474232" : "",
          }}
        >
          <span>
            {day.dayNum ? day.dayNum : i + 1}
            {day.suffix}
          </span>
          <h4>{day.name}</h4>
          <EntriesAmount entries={day.amountOfEntries} />
        </span>

        {shouldOpen && (
          <div className="day-content-container">
            {day.content.map((entry) => (
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
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default Day;

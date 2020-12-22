import React, { useEffect, useState } from "react";
import EntriesAmount from "./EntriesAmount";
import { Link } from "react-router-dom";
import { useDatabase } from "../../context/DatabaseContext";

const Day = ({ arrayOfDays, monthInfo }) => {
  const { setDeleteEntry } = useDatabase();
  const [openDays, setOpenDays] = useState([]);

  useEffect(() => {
    setOpenDays([]);
  }, [arrayOfDays]);

  const checkDayContent = (i, content) => {
    if (!content.length) {
      return;
    }

    if (openDays.includes(i)) {
      setOpenDays((prevState) => prevState.filter((dayNum) => dayNum !== i));
    } else {
      setOpenDays((prevState) => prevState.concat(i));
    }
  };

  return (
    <>
      {arrayOfDays.map((day, i) => (
        <div
          className="day"
          key={i}
          style={
            monthInfo && {
              gridColumnStart:
                i === 0
                  ? monthInfo.firstDayOfMonth === 0
                    ? 7
                    : monthInfo.firstDayOfMonth
                  : "",
            }
          }
        >
          <span
            className="day-title"
            onClick={() => checkDayContent(i, day.content)}
            style={{
              color: day.current ? "#F1C40F" : "",
              borderRadius: openDays.includes(i) ? "12px 12px 0 0" : "12px",
              backgroundColor: openDays.includes(i) ? "#474232" : "",
            }}
          >
            <span>
              {day.dayNum ? day.dayNum : i + 1}
              {day.suffix}
            </span>
            <h4>{day.name}</h4>
            <EntriesAmount entries={day.amountOfEntries} />
          </span>

          {openDays.includes(i) && (
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
      ))}
    </>
  );
};

export default Day;

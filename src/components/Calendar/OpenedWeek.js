import React from "react";
import Day from "./Day";

const OpenedWeek = ({
    week,
    weekRef,
    nextWeek,
    nextWeekRef,
    prevWeek,
    prevWeekRef,
    closeWeek
}) => {

  return (
    <div className="week-modal" onClick={closeWeek}>
      <div className="week-days">
        <button className="week-btn" ref={prevWeekRef} onClick={prevWeek}>
          <i className="fas fa-caret-left"></i>
        </button>
        <div ref={weekRef}>
          {week.map((day, i) => (
            <Day key={i} day={day} i={i} />
          ))}
        </div>
        <button className="week-btn" ref={nextWeekRef} onClick={nextWeek}>
          <i className="fas fa-caret-right"></i>
        </button>
      </div>
    </div>
  );
};

export default OpenedWeek;

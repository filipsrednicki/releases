import React, { memo, useEffect, useRef, useState } from "react";
import Day from "./Day"
import EntriesAmount from "./EntriesAmount"

const CalendarInWeeks = memo(({ monthInWeeks }) => {
  const [openWeek, setOpenWeek] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);

  const weekRef = useRef();
  const prevWeekRef = useRef();
  const nextWeekRef = useRef();

  useEffect(() => {
    setCurrentWeek(null)
    monthInWeeks.forEach((week, i) => {
      week.forEach(day => {
        if(day.current) {
          return setCurrentWeek(i)
        }
      })
    });
  }, [monthInWeeks])

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    }
  }, [])

  const positionButtons = (index) => {
    if (monthInWeeks[index].length !== 7) {
      const wait = setInterval(() => {
        const week = weekRef.current;
        if (week) {
          clearInterval(wait);
          const list = week.childNodes;
          const midList = Math.round(list.length / 2);

          if (list.length === 1) {
            prevWeekRef.current.style.top = list[midList - 1].offsetTop + "px";
            nextWeekRef.current.style.top = list[midList - 1].offsetTop + "px";
          } else {
            prevWeekRef.current.style.top = list[midList].offsetTop - 44 + "px";
            nextWeekRef.current.style.top = list[midList].offsetTop - 44 + "px";
          }
        }
      }, 10);
    }
  };

  const onShowWeek = (i) => {
    if(!monthInWeeks[i].amountOfEntries) {
      return
    }
    document.body.style.overflow = "hidden";
    setOpenWeek(i);
    positionButtons(i);
  };

  const prevWeek = () => {
    for (let i = openWeek - 1; i >= 0; i--) {
      if (monthInWeeks[i].amountOfEntries) {
        positionButtons(i);
        return setOpenWeek(i);
      }
    }
  };

  const nextWeek = () => {
    for (let i = openWeek + 1; i < monthInWeeks.length; i++) {
      if (monthInWeeks[i].amountOfEntries) {
        positionButtons(i);
        return setOpenWeek(i);
      }
    }
  };

  const closeWeek = (e) => {
    if (openWeek !== null && e.target.className === "week-modal") {
      document.body.style.overflow = "";
      setOpenWeek(null);
    }
  };

  return (
    <div className="calendar-weeks">
      {monthInWeeks.map((week, i) => (
        <div className="week-container" key={i}>
          <div className="week" onClick={() => onShowWeek(i)} style={{ color: currentWeek === i ? "#F1C40F" : "#FFF" }}>
            <h3>Week #{i + 1}</h3>
            {week.length > 1 ? (
              <>
                {week[0].dayNum + week[0].suffix} -{" "}
                {week[week.length - 1].dayNum + week[week.length - 1].suffix}
              </>
            ) : (
              week[0].dayNum + week[0].suffix
            )}
            
            {week.amountOfEntries && (
              <EntriesAmount entries={week.amountOfEntries}/>
            )}
          </div>
          {openWeek === i && (
            <div className="week-modal" onClick={closeWeek}>
              <div className="week-days">
                <button
                  className="week-btn"
                  ref={prevWeekRef}
                  onClick={prevWeek}
                >
                  <i className="fas fa-caret-left"></i>
                </button>
                <div ref={weekRef}>
                  {week.map((day, i) => (
                    <Day key={i} day={day} i={i}/>    
                  ))}
                </div>
                <button
                  className="week-btn"
                  ref={nextWeekRef}
                  onClick={nextWeek}
                >
                  <i className="fas fa-caret-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export default CalendarInWeeks;
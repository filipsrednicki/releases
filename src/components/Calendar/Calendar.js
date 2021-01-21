import React, { useState, useEffect, useRef, useCallback } from "react";
import CalendarInWeeks from "./CalendarInWeeks";
import Day from "./Day";
import ErrorNotification from "../Errors/ErrorNotification";
import { useHistory, useParams } from "react-router-dom";
import { useDatabase } from "../../context/DatabaseContext";
import Loader from "react-loader-spinner";
import "./Calendar.css";

const Calendar = () => {
  const [monthInfo, setMonthInfo] = useState({});
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [monthInWeeks, setMonthInWeeks] = useState("");
  const [isCalendarInWeeks, setIsCalendarInWeeks] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [allDaysOpen, setAllDaysOpen] = useState([]);

  const { list, isListLoading, listError } = useDatabase();
  const currentDay = useRef("");
  const monthRef = useRef([]);
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    const setWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    setWidth();
    window.addEventListener("resize", setWidth);

    if (window.innerWidth <= 800) {
      setIsCalendarInWeeks(true);
    } else {
      setIsCalendarInWeeks(false);
    }

    const currentDate = new Date();
    const today = {
      day: currentDate.getDate() - 1,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    };
    currentDay.current = today;

    return () => {
      window.removeEventListener("resize", setWidth);
    };
  }, []);

  const getMonthData = useCallback((date, monthNr) => {
    let year = date.getFullYear();
    if (monthNr < 0) {
      monthNr = 11;
      year--;
    } else if (monthNr > 11) {
      monthNr = 0;
      year++;
    }

    const daysInMonth = new Date(year, monthNr + 1, 0);
    const firstDayOfMonth = new Date(year, monthNr, 1);
    const monthName = daysInMonth.toLocaleString("en-US", { month: "long" });
    const monthInfoCopy = monthInfo;

    monthInfoCopy.year = year;
    monthInfoCopy.month = monthNr;
    monthInfoCopy.monthName = monthName;
    monthInfoCopy.firstDayOfMonth = firstDayOfMonth.getDay();
    monthInfoCopy.daysInMonth = daysInMonth.getDate();

    return monthInfoCopy;
  }, [monthInfo]);

  const addContentToMonth = useCallback((month) => {
    list.forEach((item) => {
      const [year, itemMonth, day] = item.date.split("-")
      const itemDate = new Date(year, itemMonth - 1, day);
      const mName = itemDate.toLocaleString("en-US", { month: "long" });
      const isYearMatching = itemDate.getFullYear() === monthInfo.year;
      const isMonthMatching = mName === monthInfo.monthName;
      const dayNum = itemDate.getDate() - 1;

      if (isYearMatching && isMonthMatching) {
        month[dayNum].content.push({
          name: item.name,
          date: item.date,
          id: item.id,
          epId: item.epId,
          epNum:
            item.season && `Season ${item.season} | Episode ${item.episode}`,
          genres: item.genres,
          dbId: item.dbId,
        });

        const { amountOfEntries } = month[dayNum];
        if (item.id[0] === "g") {
          amountOfEntries.games++;
        } else if (item.id[0] === "t") {
          amountOfEntries.tvShows++;
        } else {
          amountOfEntries.movies++;
        }
      }
    });

    const isCurrentYear = monthInfo.year === currentDay.current.year;
    const isCurrentMonth = monthInfo.month === currentDay.current.month;

    if (isCurrentYear && isCurrentMonth) {
      month[currentDay.current.day].current = true;
    }

    sumOfEntriesInWeek(month)
    setSelectedMonth(month);
  }, [list, monthInfo]);

  const sumOfEntriesInWeek = (month) => {
    const monthByWeek = [];
    let week = [];
    let games, movies, tvShows = 0;

    month.forEach((day, i) => {
      day.dayNum = i + 1;
      week.push(day);

      games += +day.amountOfEntries.games;
      tvShows += +day.amountOfEntries.tvShows;
      movies += +day.amountOfEntries.movies;

      const reachedEndOfWeek = day.name === "Sunday";
      const reachedEndOfMonth = month.length === i + 1;
      const shouldPushWeek = reachedEndOfWeek || reachedEndOfMonth;

      if (shouldPushWeek) {
        if (!games && !tvShows && !movies) {
          week.amountOfEntries = null;
        } else {
          week.amountOfEntries = {games, movies, tvShows};
        }

        monthByWeek.push(week);
        week = [];
        games = movies = tvShows = 0;
      }
    });

    setMonthInWeeks(monthByWeek);
  }

  const createMonth = useCallback((amountOfDays, firstDay) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const month = [...Array(amountOfDays)];
    let dayNum = 0;

    for (let i = firstDay; i < daysOfWeek.length; i++) {
      if (dayNum === amountOfDays) {
        continue;
      }

      let suffix = "th";
      if (dayNum === 0 || dayNum === 20 || dayNum === 30) {
        suffix = "st";
      } else if (dayNum === 1 || dayNum === 21) {
        suffix = "nd";
      } else if (dayNum === 2 || dayNum === 22) {
        suffix = "rd";
      }

      month[dayNum] = {
        name: daysOfWeek[i],
        suffix,
        content: [],
        amountOfEntries: {
          games: 0,
          tvShows: 0,
          movies: 0,
        },
      };
      dayNum++;

      const reachedLastDayOfWeek = i === daysOfWeek.length - 1;
      if (reachedLastDayOfWeek && dayNum < amountOfDays) {
        i = -1;
      }
    }
    addContentToMonth(month);
  }, [addContentToMonth]);

  const createCurrentMonth = useCallback(() => {
    const currentDate = new Date();
    const monthInfoCopy = getMonthData(currentDate, currentDate.getMonth());
    setMonthInfo(monthInfoCopy);
    createMonth(monthInfoCopy.daysInMonth, monthInfoCopy.firstDayOfMonth);
  }, [createMonth, getMonthData]);

  const changeMonth = (direction) => {
    let monthNr = monthInfo.month;
    if (direction === "prev") {
      monthNr--;
    } else {
      monthNr++;
    }

    const d = new Date(monthInfo.year, monthInfo.month);
    const monthInfoCopy = getMonthData(d, monthNr);
    const params = monthInfoCopy.month + 1 + "-" + monthInfoCopy.year;

    history.push("/calendar/" + params);
    setMonthInfo(monthInfoCopy);
    setAllDaysOpen([]);
    createMonth(monthInfoCopy.daysInMonth, monthInfoCopy.firstDayOfMonth);
  };

  useEffect(() => {
    if (params.date) {
      const [month, year] = params.date.split("-");
      const currentDate = new Date(year, month - 1);
      const monthInfoCopy = getMonthData(currentDate, currentDate.getMonth());

      setMonthInfo(monthInfoCopy);
      createMonth(monthInfoCopy.daysInMonth, monthInfoCopy.firstDayOfMonth);
    } else if (!params.date) {
      createCurrentMonth();
    }
  }, [createCurrentMonth, createMonth, getMonthData, list, params.date]);

  const openAllDays = () => {
    let daysWithContent = []
    selectedMonth.forEach((day, i) => {
      if(day.content.length > 0) {
        daysWithContent.push(i)
      }
    })
    setAllDaysOpen(daysWithContent)
  }

  const removeFromAllDays = useCallback((i) => {
    setAllDaysOpen((prevState) => prevState.filter((dayNum) => dayNum !== i));
  }, [setAllDaysOpen])

  const addToAllDays = useCallback((i) => {
    setAllDaysOpen((prevState) => prevState.concat(i));
  }, [setAllDaysOpen])

  return (
    <div className="calendar">
      <div className="selected-month">
        <button onClick={() => changeMonth("prev")}>
          <i className="fas fa-long-arrow-alt-left"></i>
        </button>
        <h1>
          {monthInfo.monthName} {monthInfo.year}
        </h1>
        <button onClick={() => changeMonth("next")}>
          <i className="fas fa-long-arrow-alt-right"></i>
        </button>
      </div>

      {(!isCalendarInWeeks || windowWidth > 800) && (
        <>
          <button className="open-all" onClick={openAllDays}>Open All</button>        
          <button className="close-all" onClick={() => setAllDaysOpen([])}>Close All</button>     
        </>
      )}

      <button
        className="calendar-view"
        onClick={() => setIsCalendarInWeeks((prevState) => !prevState)}
      >
        <i className="far fa-eye"></i>
      </button>

      {isListLoading ? (
        <Loader type="ThreeDots" color="#f0a211" height={120} width={120} />
      ) : (
        <>
          {listError && <ErrorNotification errMsg={listError}/>}
          {isCalendarInWeeks && windowWidth <= 800 ? (
            <CalendarInWeeks monthInWeeks={monthInWeeks} />
          ) : (
            <div className="month-container" ref={monthRef}>
              {selectedMonth.map((day, i) => (
                <Day 
                  key={i}
                  day={day}
                  i={i}
                  monthInfo={monthInfo} 
                  isInAllDays={allDaysOpen.includes(i) ? true : false} 
                  removeFromAllDays={removeFromAllDays}
                  addToAllDays={addToAllDays}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;

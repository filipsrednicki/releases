import React, { useState, useEffect, useRef } from "react";
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
  const [openDays, setOpenDays] = useState([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, params.date]);

  const getMonthData = (date, monthNr) => {
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
  };

  const createCurrentMonth = () => {
    const currentDate = new Date();
    const monthInfoCopy = getMonthData(currentDate, currentDate.getMonth());
    setMonthInfo(monthInfoCopy);
    createMonth(monthInfoCopy.daysInMonth, monthInfoCopy.firstDayOfMonth);
  };

  const createMonth = (amountOfDays, firstDay) => {
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
    let j = 0;

    for (let i = firstDay; i < daysOfWeek.length; i++) {
      if (j === amountOfDays) {
        continue;
      }

      let suffix = "th";
      if (j === 0 || j === 20 || j === 30) {
        suffix = "st";
      } else if (j === 1 || j === 21) {
        suffix = "nd";
      } else if (j === 2 || j === 22) {
        suffix = "rd";
      }

      month[j] = {
        name: daysOfWeek[i],
        suffix: suffix,
        content: [],
        amountOfEntries: {
          games: 0,
          tvShows: 0,
          movies: 0,
        },
      };
      j++;

      if (i === daysOfWeek.length - 1 && j < amountOfDays) {
        i = -1;
      }
    }
    addContentToMonth(month);
  };

  const addContentToMonth = (month) => {
    list.forEach((item) => {
      const [year, itemMonth, day] = item.date.split("-")
      const d = new Date(year, itemMonth - 1, day);
      const mName = d.toLocaleString("en-US", { month: "long" });

      if (d.getFullYear() === monthInfo.year && mName === monthInfo.monthName) {
        month[d.getDate() - 1].content.push({
          name: item.name,
          date: item.date,
          id: item.id,
          epId: item.epId,
          epNum:
            item.season && `Season ${item.season} | Episode ${item.episode}`,
          genres: item.genres,
          dbId: item.dbId,
        });

        if (item.id[0] === "g") {
          month[d.getDate() - 1].amountOfEntries.games++;
        } else if (item.id[0] === "t") {
          month[d.getDate() - 1].amountOfEntries.tvShows++;
        } else {
          month[d.getDate() - 1].amountOfEntries.movies++;
        }
      }
    });

    if (
      monthInfo.month === currentDay.current.month &&
      monthInfo.year === currentDay.current.year
    ) {
      month[currentDay.current.day].current = true;
    }

    let monthByWeek = [];
    let week = [];
    let amountOfEntries = {
      games: 0,
      movies: 0,
      tvShows: 0,
    };

    month.forEach((day, i) => {
      day.dayNum = i + 1;
      week.push(day);

      amountOfEntries.games += +day.amountOfEntries.games;
      amountOfEntries.tvShows += +day.amountOfEntries.tvShows;
      amountOfEntries.movies += +day.amountOfEntries.movies;
      if (day.name === "Sunday" || month.length === i + 1) {
        if (
          !amountOfEntries.games &&
          !amountOfEntries.tvShows &&
          !amountOfEntries.movies
        ) {
          amountOfEntries = null;
        }
        week.amountOfEntries = amountOfEntries;
        monthByWeek.push(week);
        week = [];
        amountOfEntries = {
          games: 0,
          movies: 0,
          tvShows: 0,
        };
      }
    });

    setMonthInWeeks(monthByWeek);
    setSelectedMonth(month);
  };

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
    createMonth(monthInfoCopy.daysInMonth, monthInfoCopy.firstDayOfMonth);
  };

  const openAllDays = () => {
    let daysWithContent = []
    selectedMonth.forEach((day, i) => {
      if(day.content.length > 0) {
        daysWithContent.push(i)
      }
    })
    setAllDaysOpen(daysWithContent)
  }

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
              <Day arrayOfDays={selectedMonth} monthInfo={monthInfo} openDays={openDays} setOpenDays={setOpenDays} allDaysOpen={allDaysOpen} setAllDaysOpen={setAllDaysOpen}/>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;

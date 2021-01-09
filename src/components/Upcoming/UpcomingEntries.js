import React from "react";
import AddDelBtn from "../AddDelBtn";
import { Link } from "react-router-dom";
import Image from "../Image";

const UpcomingEntries = ({ type, upcoming }) => {
  return (
    <div className="upcoming">
      {upcoming.map((entry) => (
        <div className={"upcoming-" + type} key={entry.id}>
          <Link to={"/details/" + entry.id} className="upcoming-link">
            <Image entry={entry} {...(type === "games" ? { isGameImg: true } : { width: 200 })} />
            <div className="upcoming-info">
              <h3>{entry.title || entry.name}</h3>
              {type === "shows" ? (
                <>
                  {entry.last_episode_to_air && entry.next_episode_to_air ? (
                    `${entry.last_episode_to_air.air_date} / ${entry.next_episode_to_air.air_date}`
                  ) : (
                    (entry.last_episode_to_air && entry.last_episode_to_air.air_date) || 
                    (entry.next_episode_to_air && entry.next_episode_to_air.air_date) || 
                    ""
                  )}
                </>
              ) : (
                entry.release_date || entry.released
              )}
            </div>
          </Link>
          <AddDelBtn entry={entry} loaderH="40" loaderW="40" />
        </div>
      ))}
    </div>
  );
}

export default UpcomingEntries;

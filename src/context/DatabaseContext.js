import React, { useCallback, useContext, useState } from "react";
import { auth, database } from "../firebase";

const DatabaseContext = React.createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

const DatabaseProvider = (props) => {
  const [list, setList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(null)
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [details, setDetails] = useState("");
  const [error, setError] = useState(null);
  const [listError, setListError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [delError, setDelError] = useState(false);
  const [notFound, setNotFound] = useState("");

  const createRequestUrl = (id, category) => {
    let url = "";
    if (category === "t") {
      url =
        "https://api.themoviedb.org/3/tv/" +
        id +
        "?api_key=" + process.env.REACT_APP_TMDB_API_KEY;
    } else if (category === "g") {
      url = "https://api.rawg.io/api/games/" + id;
    } else if (category === "m") {
      url =
        "https://api.themoviedb.org/3/movie/" +
        id +
        "?api_key=" + process.env.REACT_APP_TMDB_API_KEY;
    }
    return url;
  };

  const getErrorMsg = (code, isModal) => {
    let errorMsg = ""
    switch (code) {
      case "PERMISSION_DENIED":
        errorMsg =  "You don't have permission to perform this operation."
        break;
      case "EXPIRED_TOKEN":
        errorMsg =  "Your authentication token has expired."
        break;
      case "INVALID_TOKEN":
        errorMsg =  "Authentication token is invalid."
        break;
      case "MAX_RETRIES":
        errorMsg =  "The transaction had too many retries."
        break;
      default:
        errorMsg =  "An unknown error occurred."
        break;
    }

    if(isModal) {
      setErrorModal(errorMsg)
    } else {
      setListError(errorMsg)
    }
  };

  const getList = useCallback(() => {
    if (!auth.currentUser) {
      return;
    }
    const userId = auth.currentUser.uid;
    return database
      .ref("/list/" + userId)
      .once("value")
      .then((snapshot) => {
        const result = snapshot.val();
        let fetchedList = [];
        if (!result) {
          return setIsListLoading(false);
        }

        for (const [key, value] of Object.entries(result)) {
          value.dbId = key;
          fetchedList.push(value);
        }
        fetchedList.forEach((entry, i) => {
          if (Array.isArray(entry)) {
            entry.forEach((item) => {
              item.dbId = entry.dbId;
            });
            fetchedList.push(...entry);
          }
          fetchedList = fetchedList.filter((item) => !Array.isArray(item));
        });
        setList(fetchedList);
        setIsListLoading(false);
      })
      .catch((err) => {
        getErrorMsg(err.code, false);
        setIsListLoading(false);
      });
  }, []);

  const add = (entry) => {
    if (!auth.currentUser) {
      return alert("You need to be logged in to do that!");
    }

    setIsBtnLoading(entry.id)

    const category = entry.id.slice(0, 1);
    const idNum = entry.id.slice(1, entry.id.length);
    const url = createRequestUrl(idNum, category);

    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          if (category === "t") {
            fetch(
              "https://api.themoviedb.org/3/tv/" +
                idNum +
                "/season/" +
                result.number_of_seasons +
                "?api_key=ed2ca9087d4e3767429d08b8876aac06"
            )
              .then((res) => res.json())
              .then(
                (result) => {
                  let season = [];
                  result.episodes.forEach((ep, i) => {
                    const item = {
                      name: entry.name,
                      date: ep.air_date,
                      id: entry.id,
                      epId: ep.id,
                      season: ep.season_number,
                      episode: ep.episode_number,
                      description: ep.overview ? ep.overview : result.overview,
                    };
                    season.push(item);
                  });
                  storeData(season);
                }
              )
              .catch((err) => {
                setErrorModal(err.message)
                setIsBtnLoading(null)
              })
          } else {
            let genres = "";
            if (result.genres.length > 3) {
              result.genres = result.genres.slice(0, 3);
            }
            result.genres.forEach((item) => {
              genres = item.name + " " + genres;
            });

            const item = {
              name: category === "g" ? result.name : result.title,
              date: category === "g" ? result.released : result.release_date,
              id: category + result.id,
              description:
                category === "g" ? result.description_raw : result.overview,
              genres,
            };
            storeData(item);
          }
        }
      )
      .catch((err) => {
        setErrorModal(err.message)
        setIsBtnLoading(null)
      })
  };

  const storeData = (item) => {
    const userId = auth.currentUser.uid;
    const newPostKey = database
      .ref("/list/" + userId)
      .child("/")
      .push().key;
    database
      .ref("/list/" + userId + "/" + newPostKey)
      .set(item, (err) => {
        if (err) {
          getErrorMsg(err.code, true);
          setIsBtnLoading(null)
        } else {
          let listCopy = [...list];

          if (Array.isArray(item)) {
            item.forEach((entry) => {
              entry.dbId = newPostKey;
            });
            listCopy.push(...item);
          } else {
            item.dbId = newPostKey;
            listCopy.push(item);
          }
          setList(listCopy);
          setIsBtnLoading(null)
        }
      });
  };

  const remove = () => {
    setIsBtnLoading(deleteEntry.id)
    const [{ dbId }] = list.filter((item) => item.id === deleteEntry.id);
    const userId = auth.currentUser.uid;
    database
      .ref("/list/" + userId + "/" + dbId)
      .remove()
      .then(() => {
        let listCopy = [...list];
        listCopy = listCopy.filter((entry) => entry.dbId !== dbId);
        setList(listCopy);
        setDeleteEntry("");
        setDelError(false)
        setIsBtnLoading(null)
      })
      .catch((err) => {
        setDelError(true)
        setIsBtnLoading(null)
      })
  };

  const isOnList = (id) => {
    let onList = false;
    list.forEach((item, i) => {
      if (Array.isArray(item)) {
        if (id === item[0].id) {
          onList = true;
        }
      } else if (id === item.id) {
        onList = true;
      }
    });
    return onList;
  };

  const checkDetails = (id) => {
    setDetails("");
    setError(null)
    setDeleteEntry("");

    const category = id.slice(0, 1);
    if(+category) {
      return setError(`ID's first character must be one of the following letters: "m", "t" or "g".`)
    }
    const idNum = id.slice(1, id.length);
    const url = createRequestUrl(idNum, category);

    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.success === false || result.detail === "Not found.") {
            setNotFound(
              `No results for ID: ${id}. Use the Search Bar or put correct ID in the URL.`
            );
          } else {
            result.id = id;
            setDetails(result);
          }
        }
      )
      .catch((err) => {
        setError(err.message)
      })
  };

  return (
    <DatabaseContext.Provider
      value={{
        list,
        setList,
        getList,
        add,
        deleteEntry,
        setDeleteEntry,
        remove,
        isOnList,
        details,
        setDetails,
        checkDetails,
        notFound,
        error,
        setError,
        listError,
        setErrorModal,
        errorModal,
        delError,
        setDelError,
        isListLoading,
        setIsListLoading,
        isBtnLoading,
      }}
    >
      {props.children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;

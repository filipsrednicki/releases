import React from "react";
import { useDatabase } from "../context/DatabaseContext";
import { useAuth } from "../context/AuthContext";
import Loader from "react-loader-spinner";

const AddDelBtn = ({ entry, loaderH, loaderW, isText }) => {
  const {
    isListLoading,
    add,
    isOnList,
    setDeleteEntry,
    isBtnLoading,
    listError
  } = useDatabase();
  const { user, setAuthMode } = useAuth();

  const renderButton = () => {
    if (!user) { // not logged in
      return (
        <button className="btn-add" onClick={() => setAuthMode("login")}>
          {isText ? "Add to Calendar" : <i className="fas fa-plus"></i>}
        </button>
      );
    } else { // logged in
      if (isBtnLoading === entry.id || isListLoading) { // list is loading or new entry is getting added to the list
        return (
          <button className="btn-add" title="Loading...">
            <Loader
              type="ThreeDots"
              color="#1A1A1D"
              height={loaderH}
              width={loaderW}
            />
          </button>
        );
      }
      if (listError) { // error getting list
        return (
          <button className="btn-add" title="Error loading list" disabled>
            {!isText ? (
              <i className="fas fa-exclamation-triangle"></i>
            ) : (
              <>
                <i className="fas fa-exclamation-triangle"></i> Error loading
                list <i className="fas fa-exclamation-triangle"></i>
              </>
            )}
          </button>
        );
      }
      if (!isOnList(entry.id)) { // entry not on the list
        return (
          <button className="btn-add" onClick={() => add(entry)}>
            {isText ? "Add to Calendar" : <i className="fas fa-plus"></i>}
          </button>
        );
      } else { // entry on the list
        return (
          <button
            className="btn-del"
            title="Remove from Calendar"
            onClick={() => setDeleteEntry(entry)}
          >
            {isText ? "Remove from Calendar" : <i className="fas fa-times"></i>}
          </button>
        );
      }
    }
  };

  return renderButton()
};

export default AddDelBtn;

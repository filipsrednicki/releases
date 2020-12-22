import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import Calendar from "./Calendar/Calendar";
import Details from "./Details/Details";
import Upcoming from "./Upcoming/Upcoming";
import Authentication from "./Authentication";
import NotAuthorized from "./NotAuthorized";
import Nav from "./Nav";
import Footer from "./Footer";
import ErrorModal from "./Modal/ErrorModal";
import ConfirmDelModal from "./Modal/ConfirmDelModal";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../context/DatabaseContext";
import "./App.css";

const App = () => {
  const { user, isLoading, authMode } = useAuth();
  const { errorModal, getList, deleteEntry } = useDatabase();

  useEffect(() => {
    if(!user) {
      return
    }
    getList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="App">
      {!isLoading && (
        <>
          <Nav />
          {authMode && <Authentication/>}
          {errorModal && <ErrorModal/>}
          {deleteEntry && <ConfirmDelModal/>}
          <Route
            path="/calendar/:date?"
            render={() => (user ? <Calendar /> : <NotAuthorized />)}
          />
          <Route exact path="/" component={Upcoming} />
          <Route path="/details/:id" component={Details} />
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;

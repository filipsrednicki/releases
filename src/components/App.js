import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Calendar from "./Calendar/Calendar";
import Details from "./Details/Details";
import Upcoming from "./Upcoming/Upcoming";
import Authentication from "./Authentication";
import NotAuthorized from "./Errors/NotAuthorized";
import NotFoundPage from "./Errors/NotFoundPage";
import Nav from "./Nav";
import Footer from "./Footer";
import Settings from "./Settings";
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
          <Switch>
            <Route
              path="/calendar/:date?"
              render={() => (user ? <Calendar /> : <NotAuthorized />)}
            />
            <Route
              path="/settings"
              render={() => (user ? <Settings /> : <NotAuthorized />)}
            />
            <Route exact path="/" component={Upcoming} />
            <Route path="/details/:id" component={Details} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;

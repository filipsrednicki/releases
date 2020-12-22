import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = (props) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState("")

  const signUp = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const logIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password)
  };

  const logOut = () => {
    setUser('')
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(false);
      if(user) {
        setUser(user);
      }
    });

    return () => unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        logIn,
        logOut,
        isLoading,
        authMode,
        setAuthMode
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React, { useContext, useState, useEffect } from "react";
import firebase, { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = (props) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState("");

  const signUp = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const logIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logOut = () => {
    setUser("");
    return auth.signOut();
  };

  const reAuthenticate = (confPassword) => {
    const user = auth.currentUser;
    const credantials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      confPassword
    );
    return user.reauthenticateWithCredential(credantials);
  };

  const changeEmail = (email) => {
    const user = auth.currentUser;
    return user.updateEmail(email);
  };

  const changePassword = (password) => {
    const user = auth.currentUser;
    return user.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(false);
      if (user) {
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
        reAuthenticate,
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

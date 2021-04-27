import React, { useState, useEffect} from "react";
import { auth } from "../firebase.js";
import CoachProfile from "./coachProfile.jsx";
import Login from "./Login.jsx";
import StaffProfile from "./staffProfile.jsx";
import {ParentProfile} from "./parentProfile";
import SignUp from "./SignUp.jsx";




function AppContainer() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [loginView, setLoginView] = useState(false);

  const determineComponent = (user: any) => {
    if (!user.displayName) {
      return signOut();
    }
    const filteredRoleName = user.displayName?.substring(
      user.displayName?.indexOf("-") + 1
    );
    switch (filteredRoleName) {
      case "coach":
        //coach component
        return <CoachProfile />;
      case "staff":
        // teach comp
        return <StaffProfile />;
      case "parent":
        // parent comp
        return <ParentProfile />;
      default:
        return;
    }
  };
  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const signOut = () => {
    auth
      .signOut()
      .then(function () {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch(function (error) {
        // An error happened.
        console.log("error on sign out");
      });
  };
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  if (initializing) {
    return null;
  }
  return (
    <>
      {!user && (
        <ul className="nav nav-tabs">
          <li className="active">
            <button
              onClick={() => setLoginView(true)}
              className={`btn btn-outline-primary ${loginView ? "active" : ""}`}
            >
              Login
            </button>
          </li>
          <li>
            <button
              onClick={() => setLoginView(false)}
              className={`btn btn-outline-primary ${
                !loginView ? "active" : ""
              }`}
            >
              Sign Up
            </button>
          </li>
        </ul>
      )}
      {!user && (loginView ? <Login /> : <SignUp />)}
      {/* {!user && <SignUp />} */}

      {user && determineComponent(user)}
    </>
  );
}
export default AppContainer;

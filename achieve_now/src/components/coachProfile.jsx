import React from "react";
import CoachMenu from "../components/Menu/Coach_Menu";
import firebase from "firebase/app";
import "../../src/styles/page-style.css";

/**
 * coachProfile.jsx is the page the user sees when they log in as coach and where the coach side menu imported
 */

/*Sing out of the coach portal */
export const CoachProfile = () => {
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        console("signed out");
      })
      .catch(function (error) {
        // An error happened.
      });
  };


  return (
    <>
      <button className="logout-button" onClick={signOut}></button>
      <div>
        <CoachMenu />
      </div>
    </>
  );
};

export default CoachProfile;

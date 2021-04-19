import React, { useContext } from "react";
import CoachMenu from "../components/Menu/Coach_Menu";
import firebase from "firebase/app";
import { Table } from "./Tables/table";
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

  const logo = require("./achieve_now_home.jpg");
  const logout_button = require("./logout-button.jpg");

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

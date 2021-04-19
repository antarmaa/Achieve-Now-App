import React, { useContext } from "react";
import TeacherMenu from "../components/Menu/Staff_Menu";
import firebase from "firebase/app";
/**
 * staffProfile.jsx is the page the user sees when they log in as staff and where the parent side menu is imported
 */

/*Sing out of the staff portal */
export const StaffProfile = () => {
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
      <button className="logout-button" onClick={signOut}>
        logout
      </button>
      <div>
        <TeacherMenu />
      </div>
    </>
  );
};
export default StaffProfile;

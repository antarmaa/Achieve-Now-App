import React from "react";
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


  return (
    <>
    <logo></logo>
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

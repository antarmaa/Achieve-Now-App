import React, { useContext } from "react";
import firebase from "firebase/app";
import ParentMenu from "./Menu/Parent_Menu";
import "../../src/styles/page-style.css";

/**
 * parentProfile.jsx is the page the user sees when they log in as parent and where the parent side menu imported
 */

/*Sing out of the Parent portal */
export const ParentProfile = () => {
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
      <button class="logout-button" onClick={signOut}>
        logout
      </button>
      <div>
        <ParentMenu open={true} />
      </div>
    </>
  );
};

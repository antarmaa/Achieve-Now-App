import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

/**
 * This file connects to firebase and where the user documents are generated
 */

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCuuyFOArL9G0OsKjV70KdplNJ5Q37XB1M",
  authDomain: "achieve-now.firebaseapp.com",
  databaseURL: "https://achieve-now.firebaseio.com",
  projectId: "achieve-now",
  storageBucket: "achieve-now.appspot.com",
  messagingSenderId: "476677148353",
  appId: "1:476677148353:web:a1750fdb144262a444ce40",
  measurementId: "G-04B3JW4DT7",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const auth = firebase.auth();
export const firestore = firebase.firestore();

/* */
export const generateUserDocument = async (user) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email } = user;
    try {
      await userRef.set({
        email,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

/* */
const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

/* */
export const generateParentDocument = async (user) => {
  if (!user) return;
  const userRef = firestore.doc(`parent/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email} = user;

    try {
      await userRef.set({
        email,
      });
    } catch (error) {
      console.error("Error creating parent document", error);
    }
  }
  return getParentDocument(user.uid);
};

/* */
const getParentDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`parent/${uid}`).get();

    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching parent", error);
  }
};

/* */
export const generateCoachDocument = async (user) => {
  if (!user) return;
  const parentRef = firestore.doc(`coach/${user.uid}`);
  const snapshot = await parentRef.get();
  if (!snapshot.exists) {
    const { email} = user;
    try {
      await parentRef.set({
        email,
      });
    } catch (error) {
      console.error("Error creating parent document", error);
    }
  }
  return getCoachDocument(user.uid);
};

/* */
const getCoachDocument = async (uid) => {
  if (!uid) return null;
  try {
    const coachDocument = await firestore.doc(`coach/${uid}`).get();
    return {
      uid,
      ...coachDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching coach", error);
  }
};

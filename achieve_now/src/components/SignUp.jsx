import { useState } from "react";
import * as React from "react";
import "../components/login-theme.css";

import {
  auth,
  generateCoachDocument,
  generateParentDocument,
  generateUserDocument,
} from "../firebase";
import { ToastContainer, toast } from "react-toastify";

export const SignUp = () => {
  const [signUpCredentials, setSignUpCredentials] = useState({});
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [childId, setChildId] = useState();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [signUpOptions, setSignUpOptions] = useState({
    selectedOption: "",
  });
  const [authorizedUsers, setAuthorizedUsers] = React.useState([]);
  React.useEffect(() => {
    getStudentCount();
    fetch("http://localhost:3012/getRegisteredUsers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setAuthorizedUsers(result);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  const getStudentCount = async () => {
    await fetch("http://localhost:3012/getBookFromGradebook", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("data sent successfully");
          setChildId(result.length + 1);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  };
  const linkChildToParent = async (signUpData) => {
    const childData = { ...signUpData };
    delete childData.password;
    childData.id = childId;
    fetch("http://localhost:3012/addChildToParent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: childData }),
    }).then(
      (result) => {
        console.log("data sent successfully");
        window.location.reload(true);
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };
  const createUserWithEmailAndPasswordHandler = async () => {
    try {
      await auth
        .createUserWithEmailAndPassword(
          signUpCredentials.emailAddress,
          signUpCredentials.password
        )
        .then((result) => {
          result.user.updateProfile({
            displayName: getDisplayName(),
          });
          if (showExtraFields) {
            linkChildToParent(signUpCredentials);
          }
        });
    } catch (error) {
      console.log(error);
      toast.error(`Error occured during sign up`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const radioOnChange = (event) => {
    const { name, value } = event.target;
    setSignUpOptions({
      [name]: value,
    });
  };
  const formOnChange = (event) => {
    const { name, value } = event.target;
    setSignUpCredentials({ ...signUpCredentials, [name]: value });
  };

  const signUpHandler = (user) => {
    switch (signUpOptions.selectedOption) {
      case "isCoach":
        const coachDisplayName =
          signUpCredentials.emailAddress.substring(
            0,
            signUpCredentials.emailAddress.indexOf("@")
          ) + "-coach";
        generateCoachDocument(user);
        return coachDisplayName;
      //everyone of these document bitcches are gonna have a displayname
      //that contains their silly little roles
      case "isStaff":
        const staffDisplayName =
          signUpCredentials.emailAddress.substring(
            0,
            signUpCredentials.emailAddress.indexOf("@")
          ) + "-staff";
        generateUserDocument(user);
        return staffDisplayName;
      case "isParent":
        const parentDisplayName =
          signUpCredentials.emailAddress.substring(
            0,
            signUpCredentials.emailAddress.indexOf("@")
          ) + "-parent";
        generateParentDocument(user);
        return parentDisplayName;
      default:
        return "something went wong";
    }
  };

  const getDisplayName = () => {
    switch (signUpOptions.selectedOption) {
      case "isCoach":
        const coachDisplayName =
          signUpCredentials.emailAddress.substring(
            0,
            signUpCredentials.emailAddress.indexOf("@")
          ) + "-coach";
        return coachDisplayName;
      //everyone of these document bitcches are gonna have a displayname
      //that contains their silly little roles
      case "isStaff":
        const staffDisplayName =
          signUpCredentials.emailAddress.substring(
            0,
            signUpCredentials.emailAddress.indexOf("@")
          ) + "-staff";
        return staffDisplayName;
      case "isParent":
        const parentDisplayName =
          signUpCredentials.emailAddress.substring(
            0,
            signUpCredentials.emailAddress.indexOf("@")
          ) + "-parent";
        return parentDisplayName;
      default:
        return "something went wong";
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="loginContainer">
        <form>
          <h3>Sign Up</h3>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter Email"
              // whatever typed becomes the state
              name="emailAddress"
              // changes the state of the email
              required
              onChange={formOnChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              // changes the state of password
              name="password"
              required
              onChange={formOnChange}
            />
          </div>

          {showExtraFields && (
            <>
              <div className="form-group">
                <label>Enter Child's First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Child's First Name"
                  name="childFirstName"
                  required
                  onChange={formOnChange}
                />
              </div>
              <div className="form-group">
                <label>Enter Child's Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Child's Last Name"
                  name="childLastName"
                  required
                  onChange={formOnChange}
                />
              </div>
            </>
          )}

          <div>
            <input
              type="radio"
              name="selectedOption"
              value="isParent"
              id="parent"
              onChange={radioOnChange}
              onClick={() => {
                setShowExtraFields(true);
              }}
            />
            <label htmlFor="parent"> Parent</label>
            <br />
            <input
              type="radio"
              name="selectedOption"
              value="isCoach"
              id="coach"
              onChange={radioOnChange}
              onClick={() => {
                setShowExtraFields(false);
              }}
            />
            <label htmlFor="coach"> Coach</label>
            <br />
            <input
              name="selectedOption"
              type="radio"
              value="isStaff"
              id="staff"
              onChange={radioOnChange}
              onClick={() => {
                setShowExtraFields(false);
                getStudentCount();
              }}
            />
            <label htmlFor="staff"> Staff</label>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={createUserWithEmailAndPasswordHandler}
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;

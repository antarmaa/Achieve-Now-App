import * as React from "react";
// import { LoginType } from "../types/login";
import { auth } from "../firebase";
import { ResetPassword } from "./reset-password";
import { ToastContainer, toast } from "react-toastify";

export const Login = () => {
  const [loginState, setLoginStates] = React.useState();
  const [showResetPassword, setShowResetPassword] = React.useState(false);
  //change password and email state
  const setLoginState = (event) => {
    setLoginStates({
      ...loginState,
      [event.target.name]: event.target.value,
    });
  };

  const signInWithEmailAndPasswordHandler = (event) => {
    auth
      .signInWithEmailAndPassword(
        loginState?.emailAddress || "",
        loginState?.password || ""
      )
      .then((user) => {
        console.log(user);
        toast.success(`Welcome back ${user?.user?.email}!`, {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((error) => {
        console.error("Error signing in with password and email", error);
        toast.error(`Invalid Login!`, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  return (
    <>
          <ToastContainer />

      {!showResetPassword ? (
        <div className="loginContainer">
          <form>
            <h3>Login</h3>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                // whatever typed becomes the state
                name="emailAddress"
                // changes the state of the email
                onChange={setLoginState}
                required
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
                onChange={setLoginState}
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={signInWithEmailAndPasswordHandler}
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setShowResetPassword(true)}
            >
              Forgot Password
            </button>
          </form>
        </div>
      ) : (
        <ResetPassword />
      )}
    </>
  );
};

export default Login;

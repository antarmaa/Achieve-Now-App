import React from "react";
import { auth } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ResetPassword: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const handleResetPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success("Reset Email Sent", {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 5000);
      })
      .catch((error) => {
        toast.error("Email Doesn't Exist", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  const onChange = (event: any) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <form>
          <h3>Reset Password</h3>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              name="emailAddress"
              onChange={onChange}
              required
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleResetPassword}
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </>
  );
};

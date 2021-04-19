import * as React from "react";
import { ToastContainer, toast } from "react-toastify";

export const RegisterUser: React.FC = () => {
  const [email, setEmail] = React.useState({ userEmail: "" });
  const [usersList, setUsersList] = React.useState<any>();
  const tableColumns = ["Authorized Emails"];

  React.useEffect(() => {
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
          setUsersList(result.filter((email: string) => email));
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  const onChange = (email: any) => {
    setEmail({ ...email, userEmail: email });
  };

  const registerUser = () => {
    fetch("http://localhost:3012/registerUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    }).then(
      (result) => {
        toast.success(
          `Added ${email.userEmail} to authorized users to register successfully !`,
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };
  return (
    <>
      <ToastContainer />

      <div className="d-flex flex-column">
        <div className="p-2">
          <div className="siteContainer">
            <div>
              <label htmlFor="">
                <h2 className="userDescrip">Add emails to sign up</h2>
              </label>
            </div>
            <input
              className="userRegister"
              type="email"
              onChange={(event) => onChange(event.target.value)}
            />
            <div>
              <button onClick={registerUser} className="btn btn-outline">
                Add Email
              </button>
            </div>
          </div>
        </div>
        <div className="p-2 container">
          {" "}
          <table className="table mt-2">
            <thead>
              {tableColumns?.map((header, index) => {
                return <th scope="col">{header}</th>;
              })}
            </thead>
            <tbody>
              {usersList?.map((email: any, index: any) => {
                return (
                  <tr>
                    <td>{email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

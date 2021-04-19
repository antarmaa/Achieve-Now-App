import { database } from "firebase";
import React from "react";
import firebase from "firebase"; 
type TableProps = {
  data: any;
};

export const Table: React.FC<TableProps> = ({ data }) => {
  const [addLesson, setAddLesson] = React.useState(false);
  const [lesson, setLesson] = React.useState({});
  const user = firebase.auth().currentUser?.displayName?.split("-"); 
  const isAuthrorized = (user && user[1]) !== "coach" && (user && user[1]) !== "parent"; 
  const onChange = (event: any) => {
    setLesson({ [`lesson-${data.length + 1}`]: event.target.value });
  };

  const addLessonToDB = () => {
    fetch("http://localhost:3012/addLesson", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lesson),
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
  return (
    <div className="container">
      {isAuthrorized &&(
      <button onClick={() => setAddLesson(true)}>Add Lesson</button>)}
      {addLesson && (
        <div>
          <input
            type="text"
            placeholder="Type Lesson Link Here"
            onChange={onChange}
          />
          <button onClick={addLessonToDB}>submit</button>
        </div>
      )}
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Lessons</th>
          </tr>
        </thead>
        <tbody>
          <tr>
      
            {data.map((row: any, index: any) => {
              return (
                <>
                  <div key={index}></div>
                  <tr>
                    <td>
                      <a
                        href={"https://" + row[`lesson-${index + 1}`]}
                        target="_blank"
                      >
                        {`lesson-${index + 1}`}
                      </a>
                    </td>
                  </tr>
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

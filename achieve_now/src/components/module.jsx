import React from "react";
import { Table } from "./Tables/table";
import "../../src/styles/page-style.css";


/**
* To populate links into skills review 
*/

export const Module = () => {
  const [lessons, setLessons] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3012/getLessons", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const newData = result[0].lessonArr;
          setLessons(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  return <Table class="table" data={lessons} />;
};

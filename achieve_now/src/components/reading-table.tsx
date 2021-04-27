import * as React from "react";
import { LessonHistory } from "./lesson-history";
import { CSVLink } from "react-csv";
/**
* This file allows you to add, remove, and save information into the reading table
*/
type props = {
  tableData: any;
  siteName: string;
};
export const ReadingTable: React.FC<props> = ({ tableData, siteName}) => {
  const tableColumns = ["Seat", "Student", "Coach", "Notes"];
  const downloadHeaders = [
    { label: "Seat", key: "id" },
    { label: "Student", key: "studentName" },
    { label: "Coach", key: "coachName" },

  ];
  const [editTable, setEditTable] = React.useState(false);
  const [showLessonHistory, setShowLessonHistory] = React.useState(false);
  const [studentId, setStudentId] = React.useState("");
  const [readingTableData, setReadingTableData] = React.useState(tableData);

  const onChange = (id: any, propertyName: string, newValue: any) => {
    const newReadingTableData = readingTableData.map((data: any) => {
      if (data.id === id) {
        data[`${propertyName}`] = newValue;
        return data;
      } else {
        return data;
      }
    });
    setReadingTableData(newReadingTableData);
  };

  const removeStudentsFromSite = (id: string) => {

    const newClassTableData = readingTableData.map((data: any) => {
      if (data.id === id) {
        data = null
        return data;
      } else {
        return data;
      }
    }).filter((data:any)=>data);
    setReadingTableData(newClassTableData)

    fetch("http://localhost:3012/removeStudentInReading", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siteName: siteName, id: id }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
    setEditTable(false)
  };


  const saveEditedStudent = () => {
    fetch("http://localhost:3012/updateStudentsInReadingSite", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: readingTableData,
        siteName: siteName,
      }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
    setEditTable(false);
  };

  const addStudentToReadingSite = () => {
    let a: number[] = [];
    tableData.map((data: any) => {
      return a.push(data.id);
    });
    const id = a.length ? Math.max.apply(null, a) + 1 : 1;
    const studentData = {
      id: id,
      siteName: siteName,
    };
    const newTableEntry = {
      id: id,
      studentName: "",
      coachName: "",
      notes: "",
    };

    readingTableData.push(newTableEntry);
    const le = readingTableData;
    setReadingTableData(le);
    setEditTable(true);
    console.log(le);

    fetch("http://localhost:3012/addStudentToReadingSite", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };
  return showLessonHistory ? (
    <LessonHistory
      studentId={studentId}
      setLessonHistory={setShowLessonHistory}
    />
  ) : (
    <>
        {<CSVLink {...{data:readingTableData,headers:downloadHeaders,filename:"readingTable.csv"}}>Export to CSV</CSVLink>}

      {!editTable && (
      <span
      className="btn btn-outline-warning btn-sm"
      onClick={() => setEditTable(!editTable)}
    >
      <i className="fas fa-user-edit" />
    </span>
      )}
      {editTable && <button     className="btn btn-outline-success" onClick={() => saveEditedStudent()}><i className="fas fa-save"></i></button>}
      <button   className="btn btn-outline-success btn-sm" onClick={addStudentToReadingSite}><i className="fas fa-user-plus" /></button>

      {!editTable ? (
        <div className="container">
      
          <table className="table">
            <thead>
              {tableColumns.map((header, index) => {
                return <th scope="col">{header}</th>;
              })}
            </thead>
            <tbody>
              {readingTableData?.map((a: any, index: any) => (
                <tr>
                  <th scope="row">{a.id}</th>
                  <td>{a?.studentName}</td>
                  <td>{a?.coachName}</td>
                  <td>
                    <button
                    className="btn btn-outline-warning btn-sm"
                      onClick={() => {
                        setShowLessonHistory(true);
                        setStudentId(a.id);
                      }}
                    >
                      {"Notes"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="container">
          <table className="table">
            <thead>
              {tableColumns.map((header, index) => {
                return <th scope="col">{header}</th>;
              })}
            </thead>
            <tbody>
              {readingTableData?.map((a: any, index: any) => (
                <tr>
                  <th>
                    <button
                      onClick={() => removeStudentsFromSite(a.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </th>
                  <th scope="row">
                    <input
                      type="text"
                      name="id"
                      placeholder={a.id}
                      onChange={(event) =>
                        onChange(a.id, "id", event.target.value)
                      }
                    />
                  </th>
                  <td>
                    <input
                      type="text"
                      name="studentName"
                      placeholder={a?.studentName}
                      onChange={(event) =>
                        onChange(a.id, "studentName", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="coachName"
                      placeholder={a?.coachName}
                      onChange={(event) =>
                        onChange(a.id, "coachName", event.target.value)
                      }
                    />
                  </td>
                  <td>{"Notes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

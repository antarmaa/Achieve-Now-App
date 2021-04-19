import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

/**
 * class-table.tsx creates and formats a table that is created in class_page.tsx
 */

type props = {
  tableData: any;
  chosenSiteName: any;
};
export const ClassTable: React.FC<props> = ({ tableData, chosenSiteName }) => {
  /*table columns */
  const tableColumns = [
    "",
    "Seat",
    "Student",
    "Coach",
    "Lesson",
    "RS",
    "Teacher",
    "CORE",
    "Cert Check",
    "DRA",
    "GLE",
  ];

  const editTableColumns = [
    "Seat",
    "Student",
    "Coach",
    "Lesson",
    "RS",
    "Teacher",
    "CORE",
    "Cert Check",
    "DRA",
    "GLE",
  ];

  const downloadHeaders = [
    { label: "Seat", key: "id" },
    { label: "Student", key: "studentName" },
    { label: "Coach", key: "coachName" },
    { label: "Lesson", key: "lessonNumber" },
    { label: "RS", key: "rs" },
    { label: "Teacher", key: "teacher" },
    { label: "CORE", key: "core" },
    { label: "Cert Check", key: "cert_check" },
    { label: "DRA", key: "dra" },
    { label: "GLE", key: "gle" },
  ];

  const [editTable, setEditTable] = React.useState(false);
  const [classTableData, setClassTableData] = React.useState(tableData);

  /*fetch columns from database */
  const removeStudentsFromSite = (id: string) => {

    const newClassTableData = classTableData.map((data: any) => {
      if (data.id === id) {
        data = null
        return data;
      } else {
        return data;
      }
    }).filter((data:any)=>data);
    setClassTableData(newClassTableData)

    fetch("http://localhost:3012/removeStudentInSite", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siteName: chosenSiteName.siteName, id: id }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

  /*  */
  const saveChanges = (id: any, propertyName: string, newValue: any) => {
    const newClassTableData = classTableData.map((data: any) => {
      if (data.id === id) {
        data[`${propertyName}`] = newValue;
        return data;
      } else {
        return data;
      }
    });
    setClassTableData(newClassTableData)
  };

    /*  */
  const addStudentToSite = () => {
    let a: number[] = [];
    tableData.map((data: any) => {
      a.push(data.id);
    });
    const id = a.length ? Math.max.apply(null, a) + 1 : 0;
    const newTableEntry = {
      id: id,
      studentName: "",
      coachName: "",
      lessonNumber: "",
      rs: "",
      teacher: "",
      core: "",
      cert_check: "",
      dra: "",
      gle: "",
    };
    classTableData.push(newTableEntry);
    const le = classTableData;
    setClassTableData(le);
    setEditTable(true);
    fetch("http://localhost:3012/addStudentToSite", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siteName: chosenSiteName.siteName, id: id }),
    }).then(
      (result) => {
        console.log("data sent successfully");
        toast.success("Added New Student", {
          position: toast.POSITION.TOP_CENTER,
        });
     
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

    /*  */
  const saveEditedStudent = () => {
    fetch("http://localhost:3012/updateStudentsInClassSite", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: tableData,
        siteName: chosenSiteName.siteName,
      }),
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
  return (
    <>
    {<CSVLink {...{data:classTableData,headers:downloadHeaders,filename:"classTable.csv"}}>Export to CSV</CSVLink>}
      <span>
        {editTable ? (
          <button
            className="btn btn-outline-success"
            onClick={saveEditedStudent}
          >
            <i className="fas fa-save"></i>
          </button>
        ) : (
          <>
            <span
              className="btn btn-outline-warning btn-sm"
              onClick={() => setEditTable(!editTable)}
            >
              <i className="fas fa-user-edit" />
            </span>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={addStudentToSite}
            >
              <i className="fas fa-user-plus" />
            </button>
          </>
        )}
      </span>
      {!editTable ? (
        <div className="container">
          <table className="table">
            <thead>
              {tableColumns.map((header, index) => (
                <td scope="col">{header}</td>
              ))}
            </thead>
            <tbody>
              {classTableData?.map((a: any, index: any) => (
                <tr>
                  <th>
                    <button
                      onClick={() => removeStudentsFromSite(a.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    {/* <button className="btn btn-outline-warning btn-sm">
                      <i className="fas fa-pen"></i>
                    </button> */}
                  </th>

                  <th scope="row">{a.id}</th>
                  <td>{a?.studentName}</td>
                  <td>{a?.coachName}</td>
                  <td>{a?.lessonNumber}</td>
                  <td>{a?.rs}</td>
                  <td>{a?.teacher}</td>
                  <td>{a?.core}</td>
                  <td>{a?.cert_check}</td>
                  <td>{a?.dra}</td>
                  <td>{a?.gle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="container">
          <table className="table">
            <thead>
              {editTableColumns.map((header, index) => {
                return <th scope="col">{header}</th>;
              })}
            </thead>
            <tbody>
              {classTableData?.map((a: any, index: any) => {
                return (
                  <tr>
                    <th scope="row">
                      <input
                        type="text"
                        name="id"
                        value={a.id}
                        disabled={true}
                      />
                    </th>
                    <td>
                      <input
                        type="text"
                        name="studentName"
                        placeholder={a?.studentName}
                        onChange={(event) =>
                          saveChanges(a.id, "studentName", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="coachName"
                        placeholder={a?.coachName}
                        onChange={(event) =>
                          saveChanges(a.id, "coachName", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="lessonNumber"
                        placeholder={a?.lessonNumber}
                        onChange={(event) =>
                          saveChanges(a.id, "lessonNumber", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="rs"
                        placeholder={a?.rs}
                        onChange={(event) =>
                          saveChanges(a.id, "rs", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="teacher"
                        placeholder={a?.teacher}
                        onChange={(event) =>
                          saveChanges(a.id, "teacher", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="core"
                        placeholder={a?.core}
                        onChange={(event) =>
                          saveChanges(a.id, "core", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="cert_check"
                        placeholder={a?.cert_check}
                        onChange={(event) =>
                          saveChanges(a.id, "cert_check", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="dra"
                        placeholder={a?.dra}
                        onChange={(event) =>
                          saveChanges(a.id, "dra", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="gle"
                        placeholder={a?.gle}
                        onChange={(event) =>
                          saveChanges(a.id, "gle", event.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

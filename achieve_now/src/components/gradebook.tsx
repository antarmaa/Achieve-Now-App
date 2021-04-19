import firebase from "firebase";
import * as React from "react";
import { StudentProgressBar } from "./progress-bar";
import { CSVLink } from "react-csv";

/**
 *The gradebook is used in the coach and staff, this keeps track of certs, student names, and parent emails
 */

interface TableData {
  [key: string]: any;
}
export const Gradebook: React.FC = () => {
  const [edit, setEdit] = React.useState(false);
  const [modulesCount, setModulesCount] = React.useState(0);
  const [modulesArr, setModulesArr] = React.useState<any[]>([]);
  const [headerColumns, setHeaderColumns] = React.useState<string[]>([
    "",
    "id",
    "First",
    "Last",
    "Parent Email",
  ]);
  const downloadHeaders = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "ID", key: "id" },
    { label: "Parent Email", key: "parentEmail" },
  ];
  //

  const [gradeArr, setGradeArr] = React.useState<any>({});
  const [showProgressBar, setShowProgressBar] = React.useState<boolean>(false);
  const [tableData, setTableData] = React.useState<TableData[]>([]);
  const [downloadData, setDownloadData] = React.useState();
  const [csvReport, setCsvReport] = React.useState<any>();

  const removeStudentsFromSite = (id: string) => {
    const newTableData = tableData
      .map((data: any) => {
        if (data.id === id) {
          data = null;
          return data;
        } else {
          return data;
        }
      })
      .filter((data: any) => data);
    setTableData(newTableData);

    fetch("http://localhost:3012/updateStudentsGrades", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: newTableData }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

  const onChange = (event: any, id: number, index?: number) => {
    const { name, value } = event.target;
    let data = tableData;
    if (name.includes("cert")) {
      data?.map((tableD: any) => {
        if (tableD.parentEmail === id) {
          tableD.modules[`cert-${index}`] = value;
          return data;
        } else {
          return data;
        }
      });
    } else {
      if (name.includes("parentEmail")) {
        for (var i in data) {
          if (data[i].parentEmail == id) {
            data[i][name] = value;
            break;
          }
        }
      } else {
        data?.map((tableD: any, index) => {
          if (tableD.parentEmail === id) {
            tableD[name] = value;
          }
          return data;
        });
      }
    }
    setTableData([]);
    setTableData(data);
  };
  React.useEffect(() => {
    fetch("http://localhost:3012/getBookFromGradebook", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const newData = result
            ?.map((data: any) => {
              return {
                firstName: data.firstName,
                lastName: data.lastName,
                id: data.id,
                modules: data?.modules,
                parentEmail: data?.parentEmail,
              };
            })
            ?.filter((data: any) => data);
          const newTableData = newData;
          const ull = newTableData?.reduce(
            (prev: { count: number }, curr: any) => {
              prev.count =
                prev.count > Object.keys(curr?.modules)?.length
                  ? prev.count
                  : Object.keys(curr?.modules)?.length;
              return prev;
            },
            { count: 0 }
          );
          let newArray1 = [];
          if (ull) {
            for (let i = 0; i <= ull.count; i++) {
              newArray1 = [...headerColumns, `Cert ${i + 1}`];
              headerColumns.push(`Cert ${i + 1}`);
              downloadHeaders.push({
                label: `Cert ${i + 1}`,
                key: `modules.cert-${i}`,
              });
            }
          }
          const csvReportData = {
            data: newData,
            headers: downloadHeaders,
            filename: "gradebook.csv",
          };
          setCsvReport(csvReportData);
          setTableData(newTableData);

          let newArray = [...headerColumns];
          let modulesArr = [];
          setModulesCount(ull?.count || 0);
          if (ull) {
            for (let i = 0; i <= ull.count + 1; i++) {
              newArray = [...headerColumns, `Cert ${i + 1}`];

              setHeaderColumns(newArray);
              modulesArr.push("a");
              setModulesArr(modulesArr);
            }
          } else {
            newArray = [
              ...headerColumns,
              `Cert ${headerColumns?.length - 3 + 1}`,
            ];
            headerColumns.push(`Cert 1`);
            setHeaderColumns(newArray);
          }
        },
        (error) => {
          console.log("bro we got an error" + error);
        }
      );
  }, []);
//function to add columns(certs)
  const addColumn = (id: string) => {
    const count = headerColumns.length;
    const newArray = [...headerColumns, `Cert ${count - 5 + 1}`];
    setHeaderColumns(newArray);
    tableData.find((module) =>
      module.id === +id
        ? Object.assign(module?.modules, { [`cert-${count - 3 + 1}`]: "" })
        : ""
    );
    const newModuleArr = modulesArr;
    newModuleArr.push("a");
    setModulesArr(newModuleArr);
    setEdit(!edit);
  };
//function to add another student(row) to the gradebook
  const addRow = () => {
    let a: number[] = [];
    tableData?.map((data: any) => {
      a.push(data.id);
    });
    const id = a.length ? Math.max.apply(null, a) + 1 : 1;
    const emptyRow = {
      id: id,
      firstName: "",
      lastName: "",
      modules: {},
      parentEmail: "",
    };
    if (tableData) {
      const t = [...tableData];
      t.push(emptyRow);
      setTableData(t);
    } else {
      const newTable = [];
      newTable.push(emptyRow);
      setTableData(newTable);
    }
    setEdit(!edit);
  };

  //to save new information to databases 
  const saveGrades = () => {
    let newData: any[] = [];
    tableData.forEach((data) => newData.push(data));
    fetch("http://localhost:3012/updateStudentsGrades", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: newData }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };
  return showProgressBar ? (
    <StudentProgressBar
      grades={gradeArr?.grades}
      studentName={gradeArr?.name}
      setShowProgressBar={setShowProgressBar}
    />
  ) : !edit ? (
    <div className="container">
      {tableData?.length > 0 && <CSVLink {...csvReport}>Export to CSV</CSVLink>}
      <button className="btn btn-warning" onClick={() => setEdit(true)}>
        <i className="fas fa-pen" />
      </button>
      <button
        className="btn btn-success float-right"
        onClick={() => {
          addRow();
        }}
      >
        <i className="fas fa-user-plus" />
      </button>
      <table className="table">
        <thead>
          {headerColumns.map((header, index) => {
            return <th scope="col">{header}</th>;
          })}
        </thead>
        <tbody>
          {/* return the first name, last name, modules */}
          {tableData?.map((a, index) => {
            return (
              <tr>
                <th scope="row">
                  <span
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => {
                      addColumn(a?.id);
                    }}
                  >
                    <i className="fas fa-plus-square" />
                  </span>
                  <span
                    className="btn btn-outline-success btn-sm"
                    onClick={() => {
                      setShowProgressBar(true);
                      setGradeArr({
                        grades: a.modules,
                        name: `${a.firstName} ${a.lastName}`,
                      });
                    }}
                  >
                    <i className="fas fa-tasks" />
                  </span>
                  <span
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeStudentsFromSite(a.id)}
                  >
                    <i className="fas fa-trash" />
                  </span>
                </th>
                <th scope="row">{a?.id}</th>
                <td>{a?.firstName}</td>
                <td>{a?.lastName}</td>
                <td>{a?.parentEmail}</td>

                {modulesArr.length > 0 &&
                  modulesArr?.map((something, indexx) => (
                    <td>{a?.modules ? a?.modules[`cert-${indexx}`] : ""}</td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="container">
      <button
        className="btn btn-primary"
        onClick={() => {
          setEdit(!edit);
          saveGrades();
        }}
      >
        {" "}
        Save
      </button>
      <button
        className="btn btn-warning"
        onClick={() => {
          setEdit(false);
        }}
      >
        {" "}
        Cancel
      </button>
      <table className="table">
        <thead>
          {headerColumns.map((header, index) => {
            return <th scope="col">{header}</th>;
          })}
        </thead>
        <tbody>
          {tableData?.map((a, index) => {
            return (
              <tr>
                <th></th>
                <th scope="row">
                  <input
                    type="text"
                    name="id"
                    className="w-50"
                    value={a.id}
                    disabled={true}
                  />
                </th>
                <td>
                  <input
                    type="text"
                    name="firstName"
                    className="w-50"
                    placeholder={a.firstName}
                    onChange={(event) => onChange(event, a.parentEmail)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lastName"
                    className="w-50"
                    placeholder={a.lastName}
                    onChange={(event) => onChange(event, a.parentEmail)}
                  />
                </td>
                <td>
                  <input
                    type="email"
                    name="parentEmail"
                    required={true}
                    className="w-100"
                    placeholder={a?.parentEmail}
                    onChange={(event) => onChange(event, a.parentEmail)}
                  />
                </td>
                {modulesArr?.length > 0 &&
                  modulesArr?.map((ss, indexx) => (
                    <td>
                      <input
                        type="text"
                        name={`cert-${indexx}`}
                        className="w-50"
                        placeholder={
                          a?.modules ? a?.modules[`cert-${indexx}`] : ""
                        }
                        onChange={(event) =>
                          onChange(event, a?.parentEmail, indexx)
                        }
                      />
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

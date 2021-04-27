import firebase from "firebase";
import * as React from "react";
import { StudentProgressBar } from "./progress-bar";

/**
 * To modify the parent gradebook in the parent portal 
 */

interface TableData {
  [key: string]: any;
}
export const GradebookParent: React.FC = () => {
  const [modulesCount, setModulesCount] = React.useState(0);
  const [modulesArr, setModulesArr] = React.useState<any[]>([]);
  const [headerColumns, setHeaderColumns] = React.useState<string[]>([
    "",
    "id",
    "First",
    "Last",
    "Parent Email"
  ]);
  //
  const [gradeArr, setGradeArr] = React.useState<any>({});
  const [showProgressBar, setShowProgressBar] = React.useState<boolean>(false);
  const [tableData, setTableData] = React.useState<TableData[]>([]);


  
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
            .map((data: any) => {
              const user = firebase.auth().currentUser;
              if (data?.parentEmail?.toLowerCase() ===user?.email) {
                
              return {
                firstName: data.firstName,
                lastName: data.lastName,
                id: data.id,
                parentEmail:data.parentEmail,
                modules: data?.modules,
              };
            }
            return null
            })
            ?.filter((data: any) => data);
          const newTableData = newData;
          setTableData(newTableData);
          const ull = newTableData.reduce(
            (prev: { count: number }, curr: any) => {
              prev.count =
                prev.count > Object.keys(curr?.modules)?.length
                  ? prev.count
                  : Object.keys(curr?.modules)?.length;
              return prev;
            },
            { count: 0 }
          );
          let newArray = [...headerColumns];
          let modulesArr = [];
          console.log(modulesCount)
          setModulesCount(ull?.count || 0);
          if (ull) {
            for (let i = 0; i <= ull.count + 1; i++) {
              newArray = [...headerColumns, `Cert ${i + 1}`];
              headerColumns.push(`Cert ${i + 1}`);
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
  });



  return showProgressBar ? (
    <StudentProgressBar
      grades={gradeArr?.grades}
      studentName={gradeArr?.name}
      setShowProgressBar={setShowProgressBar}
    />
  )  :(
    <div className="container">
      <table className="table">
        <thead>
          {headerColumns.map((header, index) => {
            return <th scope="col">{header}</th>;
          })}
        </thead>
        <tbody>
          {/* return the first name, last name, modules */}
          {tableData.map((a, index) => {
            return (
              <tr>
                <th scope="row">
  
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
      
                </th>
                <th scope="row">{a?.id}</th>
                <td>{a?.firstName}</td>
                <td>{a?.lastName}</td>
                <td >{a?.parentEmail}</td>

                {modulesArr.length > 0 &&
                  modulesArr?.map((something, indexx) => (
                    <td>
                      {a?.modules
                        ? a?.modules[`cert-${indexx}`]
                        : ""}
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};


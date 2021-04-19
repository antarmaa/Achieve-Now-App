import * as React from "react";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

/**
 *The profile table is where excel sheets can be imported and exportd into a table format
 */

interface TableData {
  [key: string]: any;
}
export const ProfileTable: React.FC = () => {
  const [edit, setEdit] = React.useState(false);
  const massEmailSignUpList: any = [];
  const massEmailSignUpList2: any = [];

  const [headerColumns, setHeaderColumns] = React.useState<string[]>([
    "",
    "Site",
    "Reading Specialist",
    "Seat #",
    "School",
    "Teacher",
    "Grade",
    "Student First",
    "Student Last",
    "Parent First",
    "Parent Last",
    "Parent Phone",
    "Parent Email",
    "Coach First",
    "Coach Last",
    "Coach Email",
  ]);

  const editHeaderColumns = [
    "Site",
    "Reading Specialit",
    "Seat #",
    "School",
    "Teacher",
    "Grade",
    "Student First",
    "Student Last",
    "Parent First",
    "Parent Last",
    "Parent Phone",
    "Parent Email",
    "Coach First",
    "Coach Last",
    "Coach Email",
  ];
  const [uploadedFile, setUploadedFile] = React.useState<any>();
  const downloadHeaders = [
    { label: "Site", key: "site" },
    { label: "Reading Specialist", key: "readingSpecialist" },
    { label: "Seat #", key: "seatNUmber" },
    { label: "School", key: "school" },
    { label: "Teacher", key: "teacher" },
    { label: "Grade", key: "grade" },
    { label: "Student First", key: "studentFirst" },
    { label: "Student Last", key: "studentLast" },
    { label: "Parent First", key: "parentFirst" },
    { label: "Parent Last", key: "parentLast" },
    { label: "Parent Phone", key: "parentPhone" },
    { label: "Parent Email", key: "parentEmail" },
    { label: "Coach First", key: "coachFirst" },
    { label: "Coach Last", key: "coachLast" },
    { label: "Coach Email", key: "coachEmail" },
  ];
  //

  const [gradeArr, setGradeArr] = React.useState<any>({});
  const [showProgressBar, setShowProgressBar] = React.useState<boolean>(false);
  const [tableData, setTableData] = React.useState<TableData[]>([]);
  const [downloadData, setDownloadData] = React.useState();
  const [csvReport, setCsvReport] = React.useState<any>();
  const [childId, setChildId] = React.useState();

  React.useEffect(() => {
    fetch("http://localhost:3012/getProfile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result: any) => {
          console.log("data sent successfully");
          setUploadedFile(result[0]?.profileTable);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  const onChange = (event: any, seatNumber: number, index?: number) => {
    const { name, value } = event.target;
    let data = uploadedFile;

    for (var i in data) {
      if (data[i].seatNumber == seatNumber) {
        data[i][name] = value;
        break;
      }
    }

    setUploadedFile([]);
    setUploadedFile(data);
  };
  const removeRow = (id: number) => {
    const newTableData = uploadedFile
      .map((data: any) => {
        if (data.seatNumber === id) {
          data = null;
          return data;
        } else {
          return data;
        }
      })
      ?.filter((data: any) => data);

    setUploadedFile([]);

    setUploadedFile(newTableData);
    fetch("http://localhost:3012/insertIntoProfile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileTable: newTableData }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };
  const handleUpload = (e: any) => {
    e.preventDefault();

    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target?.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const formattedData = dataParse
        .filter((xl: any) => xl.length > 0)
        ?.map((profile: any, index) => {
          if (index > 0) {
            if (
              !massEmailSignUpList?.includes(profile[14]) &&
              !massEmailSignUpList?.includes(profile[11])
            ) {
              massEmailSignUpList.push({
                emailAddress: profile[11],
                childFirstName: profile[6],
                childLastName: profile[7],
                coachEmail: profile[14],
              });
              massEmailSignUpList2.push(profile[11]);
              massEmailSignUpList2.push(profile[14]);
            }
            return {
              site: profile[0],
              readingSpecialist: profile[1],
              seatNumber: profile[2],
              school: profile[3],
              teacher: profile[4],
              grade: profile[5],
              studentFirst: profile[6],
              studentLast: profile[7],
              parentFirst: profile[8],
              parentLast: profile[9],
              parentPhone: profile[10],
              parentEmail: profile[11],
              coachFirst: profile[12],
              coachLast: profile[13],
              coachEmail: profile[14],
            };
          }
        });
      setUploadedFile(formattedData.filter((xl) => xl));
      console.log(formattedData.filter((xl) => xl));
      saveUploadedData(formattedData.filter((xl) => xl));
      console.log(massEmailSignUpList);
      sendEmails(massEmailSignUpList2);
      getStudentCount();
    };
    reader.readAsBinaryString(f);
  };

  const sendEmails = (data: any) => {
    fetch("http://localhost:3012/sendEmails", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailList: data }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };
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
  const linkChildToParent = async (signUpData: any) => {
    signUpData.id = childId;
    fetch("http://localhost:3012/addChildToParent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: signUpData }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

  const addRow = () => {
    let a: number[] = [];
    uploadedFile.map((data: any) => {
      a.push(data.seatNumber);
    });
    const id = a.length ? Math.max.apply(null, a) + 1 : 1;
    const emptyRow = {
      site: "",
      readingSpecialist: "",
      seatNumber: id,
      school: "",
      teacher: "",
      grade: "",
      studentFirst: "",
      studentLast: "",
      parentFirst: "",
      parentLast: "",
      parentPhone: "",
      parentEmail: "",
      coachFirst: "",
      coachLast: "",
      coachEmail: "",
    };
    uploadedFile.push(emptyRow);
    const le = uploadedFile;
    setUploadedFile(le);
    setEdit(!edit);
  };

  const saveUploadedData = (fileData: any) => {
    fetch("http://localhost:3012/insertIntoProfile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileTable: fileData }),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

  return !edit ? (
    <div className="container">
      {uploadedFile?.length <= 0 && (
        <>
          {" "}
          <label htmlFor="avatar">Choose an excel file to upload:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleUpload}
          />
        </>
      )}
      {uploadedFile?.length > 0 && (
        <CSVLink
          {...{
            data: uploadedFile,
            headers: downloadHeaders,
            filename: "profileTable.csv",
          }}
        >
          Export to CSV
        </CSVLink>
      )}

      {/* {tableData.length > 0 && <CSVLink {...csvReport}>Export to CSV</CSVLink>} */}
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
          {uploadedFile?.map((a: any, index: number) => {
            return (
              <tr>
                <th scope="row">
                  <span
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      removeRow(a.seatNumber);
                    }}
                  >
                    <i className="fas fa-trash" />
                  </span>
                </th>
                <td>{a?.site}</td>
                <td>{a?.readingSpecialist}</td>
                <td>{a?.seatNumber}</td>
                <td>{a?.school}</td>
                <td>{a?.teacher}</td>
                <td>{a?.grade}</td>
                <td>{a?.studentFirst}</td>
                <td>{a?.studentLast}</td>
                <td>{a?.parentFirst}</td>
                <td>{a?.parentLast}</td>
                <td>{a?.parentPhone}</td>
                <td>{a?.parentEmail}</td>
                <td>{a?.coachFirst}</td>
                <td>{a?.coachLast}</td>
                <td>{a?.coachEmail}</td>

                {/* <td>{a?.parentEmail}</td>*/}
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
          saveUploadedData(uploadedFile);
        }}
      >
        Save
      </button>
      <button
        className="btn btn-warning"
        onClick={() => {
          setEdit(false);
        }}
      >
        Cancel
      </button>
      <table className="table">
        <thead>
          {editHeaderColumns.map((header, index) => {
            return <th scope="col">{header}</th>;
          })}
        </thead>
        <tbody>
          {/* return the first name, last name, modules */}
          {uploadedFile?.map((a: any, index: number) => {
            return (
              <tr>
                <td>
                  <input
                    type="text"
                    name="site"
                    placeholder={a.site}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="readingSpecialist"
                    placeholder={a.readingSpecialist}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="seatNumber"
                    placeholder={a.seatNumber}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="school"
                    placeholder={a.school}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="teacher"
                    placeholder={a.teacher}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="grade"
                    placeholder={a.grade}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="studentFirst"
                    placeholder={a.studentFirst}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="studentLast"
                    placeholder={a.studentLast}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="parentFirst"
                    placeholder={a.parentFirst}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="parentLast"
                    placeholder={a.parentLast}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="parentPhone"
                    placeholder={a.parentPhone}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="parentEmail"
                    placeholder={a.parentEmail}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="coachFirst"
                    placeholder={a.coachFirst}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="coachLast"
                    placeholder={a.coachLast}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="coachEmail"
                    placeholder={a.coachEmail}
                    onChange={(event) => onChange(event, a.seatNumber)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
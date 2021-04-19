import * as React from "react";

/**
 *
 */


type props = {
  studentId: string;
  setLessonHistory:any
};
export const LessonHistory: React.FC<props> = ({ studentId,setLessonHistory }) => {
  const tableColumns = ["Date", "Lesson"];
  const [editTable, setEditTable] = React.useState(false);
  const [lessonHistory, setLessonHistoryTable] = React.useState<any>([]);
  const [addRow, setAddRow] = React.useState(false);

  React.useEffect(() => {
    fetch("http://localhost:3012/getLessonHistory", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const newData = result?.filter(
            (lesson: any) => lesson.studentId === studentId
          );
          setLessonHistoryTable(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  const addLessonNote = () => {
    const date = new Date();
    const num = lessonHistory?.length > 0 ? lessonHistory.length + 1 : 1;
    const newTableEntry = {
      [`lesson-${num}`]: "",
      [`lesson-${num}-date`]: `${date?.toDateString()}-${date.toLocaleTimeString()}`,
      studentId: studentId,
    };
    lessonHistory.push(newTableEntry);
    const le = lessonHistory;
    setLessonHistoryTable(lessonHistory);
    setEditTable(!editTable);
    console.log(le);
    setEditTable(true);
  };

  const onChange = (index: number, lessonNote: string, time: string) => {
    const newLessonHistory = lessonHistory?.map((lesson: any) => {
      if (lesson[`lesson-${index}-date`] === time) {
        lesson[`lesson-${index}`] = lessonNote;
        return lesson;
      } else {
        return lesson;
      }
    });
    setLessonHistoryTable(newLessonHistory);
  };

  const onSave = () => {
    fetch("http://localhost:3012/addLessonHistoryToStudent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lessonHistory),
    }).then(
      (result) => {},
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

  return !editTable ? (
    <>
      {!editTable && (
        <button className="btn btn-outline-warning btn-sm" onClick={() => setEditTable(true)}>{"Edit"}</button>
      )}
      <button className="btn btn-outline-warning btn-sm" onClick={()=>setLessonHistory(false)}> go back to the table</button>

      <button className="btn btn-outline-warning btn-sm" onClick={() => addLessonNote()}>add row </button>

      <div className="container">
        <table className="table">
          <thead>
            {tableColumns?.map((header, index) => {
              return <th scope="col">{header}</th>;
            })}
          </thead>
          <tbody>
            {lessonHistory?.map((a: any, index: any) => {
              return (
                <tr>
                  <td>{a[`lesson-${index + 1}-date`]}</td>
                  <td>{a[`lesson-${index + 1}`]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <>
      {editTable && (
        <button
          onClick={() => {
            setEditTable(false);
            onSave();
          }}
        >
          {"Save"}
        </button>
      )}
      <button onClick={()=>setLessonHistory(false)}> go back to the table</button>

      <div className="container">
        <table className="table">
          <thead>
            {tableColumns.map((header, index) => {
              return <th scope="col">{header}</th>;
            })}
          </thead>
          <tbody>
            {lessonHistory?.map((a: any, index: any) => {
              return (
                <tr>
                  <td>{<td>{a[`lesson-${index + 1}-date`]}</td>}</td>
                  <td>
                    {
                      <input
                        type="text"
                        placeholder={a[`lesson-${index + 1}`]}
                        onChange={(event) => {
                          onChange(
                            index + 1,
                            event.target.value,
                            a[`lesson-${index + 1}-date`]
                          );
                        }}
                      />
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { ClassTable } from "./class-table";

/**
 * class_page.jsx allows a user to select a site and then populate a table with a list of students and their class information
 */
export const ClassPage = () => {
  /*states user input fields  */
  const [classData, setClassData] = React.useState([]);
  const [newSiteName, setNewSiteName] = React.useState("");
  const [showTable, setShowTable] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState({});

  /*Fetch  sites and tables already stored in the database*/
  React.useEffect(() => {
    fetch("http://localhost:3012/getClassData", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const newData = result[0].data;
          setClassData(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  /*show table based on selected site name */
  const getTableDataBySiteName = (name) => {
    const siteData = classData?.find((data) => data.siteName === name);
    setSelectedSite(siteData);
    setShowTable(true);
  };

  /*Set the site name to user inuput */
  const onChange = (event) => {
    setNewSiteName(event.target.value);
  };

  /*Add a new site object to mongo */
  const addSite = (event) => {
    if (newSiteName?.length > 0) {
      let a = [];
      const data = {
        id: classData?.length ? Math.max.apply(null, a) + 1 : 1,
        siteName: newSiteName,
      };

      fetch("http://localhost:3012/createClassSite", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(
        (result) => {
          console.log("data sent successfully");
          window.location.reload(true);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
    }
  };

  /*render data fields and site menu drop down */
  return (
    <div className="container">
      <div>
        {!showTable ? (
          <>
            <div className="siteContainer">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                  <h1 className="class-title">Class Pages</h1>
                </div>
              </div>
              <div className="p-2">
                <h2 className="addSiteText">Add a Class</h2>
              </div>
              <div class="d-flex justify-content-center">
                <input type="text" onChange={onChange} />
              </div>
              <div className="d-flex justify-content-center">
                <div className="p-2">
                  <button className="btn btn-success" onClick={addSite}>
                    Add a Class
                  </button>
                </div>
              </div>
              <div className="p-2">
                <h2 className="chooseSiteName">Choose a Class </h2>
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  className=""
                  variant="success"
                  id="dropdown-basic"
                >
                  Class Names
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {classData?.map((reading) => {
                    return (
                      <Dropdown.Item
                        onClick={(event) =>
                          getTableDataBySiteName(event.target.textContent)
                        }
                      >
                        {reading?.siteName}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        ) : (
          <>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => setShowTable(!showTable)}
            >
              Go back to adding sites
            </button>

            <ClassTable
              tableData={selectedSite.students}
              chosenSiteName={selectedSite}
            />
          </>
        )}
      </div>
    </div>
  );
};

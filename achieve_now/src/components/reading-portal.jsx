import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { ReadingTable } from "../components/reading-table.tsx";


/**
 * The file is where reading sites can be added to a dropdown list and created and stored in the databases
 */

export const ReadingPages = () => {
  const [readingData, setReadingData] = React.useState([]);
  const [newSiteName, setNewSiteName] = React.useState("");
  const [showTable, setShowTable] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState({});
  const [selectedSiteName, setSelectedSiteName] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:3012/getReadingData", {
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
          setReadingData(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  const getTableDataBySiteName = (name) => {
    const siteData = readingData?.find((data) => data.siteName === name);
    setSelectedSite(siteData);
    setSelectedSiteName(name);
    setShowTable(true);
  };
  const onChange = (event) => {
    setNewSiteName(event.target.value);
  };
  const addSite = (event) => {
    if (newSiteName?.length > 0) {
      let a = [];
      const data = {
        id: readingData?.length ? Math.max.apply(null, a) + 1 : 1,
        siteName: newSiteName,
      };
      fetch("http://localhost:3012/createReadingSite", {
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

  return (
    <div className="container">
      <div>
        {!showTable ? (
          <div className="siteContainer">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-center">
                {" "}
                <h1 className="reading-title">Reading Pages</h1>
              </div>
            </div>
            <div className="p-2">
              <h2 className="addSiteText">Add a Site</h2>
            </div>
            <div class="d-flex justify-content-center">
              <input type="text" onChange={onChange} />
            </div>
            <div className="d-flex justify-content-center">
              <div className="p-2">
                <button className="btn btn-success" onClick={addSite}>
                  Add Site
                </button>
              </div>
            </div>
            <div className="p-2">
              <div className="p-2">
                <h2 className="chooseSiteName">Choose a Site</h2>
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  className=""
                  variant="success"
                  id="dropdown-basic"
                >
                  Site Names
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {readingData?.map((reading) => {
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
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => setShowTable(!showTable)}
            >
              Go back to adding sites
            </button>
            <ReadingTable
              tableData={selectedSite.students}
              siteName={selectedSiteName}
            />
          </>
        )}
      </div>
    </div>
  );
};

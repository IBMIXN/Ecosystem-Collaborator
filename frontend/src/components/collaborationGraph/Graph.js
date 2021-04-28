import GraphRow from "./GraphRow";
import GraphLines from "./GraphLines";
import "./Graph.css";
import { xcoords, ycoords_start, ycoords_gap } from "./GraphProperties";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const specs = ["Design", "Technical", "Marketing", "Sales"];

function Graph(props) {
  const [nodeMouseOver, setNodeMouseOver] = useState({ row: -1, column: -1 });
  const [showIndustryInfo, setShowIndustryInfo] = useState(false);
  const lockedData = props.lockedData;
  const setLockedData = props.setLockedData;
  const lockedStatus = props.lockedStatus;
  const setLockedStatus = props.setLockedStatus;

  function handleCheck(companyID) {
    if (lockedStatus.includes(companyID)) {
      const newLockedStatus = lockedStatus.filter((item) => item !== companyID);
      setLockedStatus(newLockedStatus);
      setLockedData(lockedData.filter((item) => item.id !== companyID));
      return;
    }
    if (lockedStatus.length >= 10) {
      return;
    }
    setLockedStatus([...lockedStatus, companyID]);
    var dataToAdd;
    props.data.some((company) => {
      if (company.id === companyID) {
        dataToAdd = company;
        return true;
      }
      return false;
    });
    setLockedData([...lockedData, dataToAdd]);
  }

  if (props.loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const data = props.data;

  if (data === undefined) {
    return <div />;
  }

  const unlockedData = props.data.filter(
    (company) => !lockedStatus.includes(company.id)
  );

  const graphData = [...lockedData, ...unlockedData];

  const ycoords = new Array(graphData.length)
    .fill(ycoords_start)
    .map((item, index) => item + index * ycoords_gap);

  if (data.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="graph-container">
      <svg viewBox={"0 0 800 " + (graphData.length + 1) * 75}>
        {specs.map((text, index) => (
          <text key={index} textAnchor="middle" x={xcoords[index]} y={30}>
            {text}
          </text>
        ))}
        <text
          x={0}
          y={20}
          className="graph-help"
          onClick={() => setShowIndustryInfo(!showIndustryInfo)}
        >
          {showIndustryInfo ? "Hide " : "Show "} specialisation info
        </text>
        <text textAnchor="middle" x={xcoords[3] + 90} y={30}>
          {"Lock"}
        </text>

        <GraphLines
          current={nodeMouseOver}
          data={graphData}
          xcoords={xcoords}
          ycoords={ycoords}
        />
        {graphData.map((companyData, index) => (
          <GraphRow
            showIndustryInfo={showIndustryInfo}
            locked={lockedStatus.includes(companyData.id)}
            handleCheck={() => handleCheck(companyData.id)}
            setNodeMouseOver={setNodeMouseOver}
            key={index}
            rowIndex={index}
            y={ycoords[index]}
            data={companyData}
            setSelectedCompany={props.setSelectedCompany}
          />
        ))}
      </svg>
    </div>
  );
}
export default Graph;

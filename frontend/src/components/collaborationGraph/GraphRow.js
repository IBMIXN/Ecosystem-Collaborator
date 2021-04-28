import GraphNode from "./GraphNode";
import { xcoords } from "./GraphProperties";
import GraphCheckBox from "./GraphCheckBox";

const specs = ["Design", "Technical", "Marketing", "Sales"];

function GraphRow(props) {
  const data = props.data;

  function getType(index) {
    if (data.primarySpecifications.includes(specs[index])) {
      return "primary";
    }
    if (data.secondarySpecifications.includes(specs[index])) {
      return "secondary";
    }
    return "none";
  }

  function onMouseEnter(row, column) {
    props.setNodeMouseOver({ row: row, column });
  }

  return (
    <>
      <text
        style={{ cursor: "pointer" }}
        y={props.y}
        x={3}
        onClick={() => props.setSelectedCompany(data)}
      >
        {data.companyName}
      </text>
      <text y={props.y + 10} fontSize="10" x={3}>
        tier {data.tier}
      </text>
      {xcoords.map((x, index) => (
        <g key={index}>
          <GraphNode
            maxX={props.maxX}
            maxY={props.maxY}
            type={getType(index)}
            onMouseEnter={() => onMouseEnter(props.rowIndex, index)}
            onMouseLeave={() => onMouseEnter(-1, -1)}
            x={x}
            y={props.y}
            tier={data.tier}
          />
          <text
            display={props.showIndustryInfo ? "block" : "none"}
            className="node-info"
            x={x}
            y={props.y + 30}
          >
            {getType(index) === "none" ? "" : getType(index)}
          </text>
        </g>
      ))}
      <GraphCheckBox
        locked={props.locked}
        handleCheck={props.handleCheck}
        x={xcoords[3] + 90 - 6}
        y={props.y - 6}
        width="12"
      />
    </>
  );
}

export default GraphRow;

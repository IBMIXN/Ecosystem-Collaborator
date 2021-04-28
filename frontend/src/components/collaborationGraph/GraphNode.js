import PropTypes from "prop-types";
import { nodeSize } from "./GraphProperties";

function GraphNode(props) {
  var stroke;
  var fill = props.type === "primary" ? "#190061" : "#610010";

  var circle = <></>;
  if (props.type === "primary") {
    circle = (
      <circle cx={props.x} cy={props.y} r={nodeSize} fill="#3500d3">
        <animate
          attributeType="CSS"
          attributeName="r"
          from="0"
          to={nodeSize - 1}
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    );
  }

  switch (props.tier) {
    // case 1:
    //   stroke = "green";
    //   break;
    // case 2:
    //   stroke = "#ff7700";
    //   break;
    // case 3:
    //   stroke = "yellow";
    //   break;
    // case 4:
    //   stroke = "red";
    //   break;
    default:
      stroke = "black";
  }
  if (props.type === "none") {
    return <></>;
  }
  return (
    <>
      <circle
        cx={props.x}
        cy={props.y}
        r={nodeSize}
        stroke={stroke}
        fill={fill}
        strokeWidth="4"
      ></circle>
      {circle}
      <circle
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        cx={props.x}
        cy={props.y}
        r={nodeSize}
        opacity={0}
      ></circle>
    </>
  );
}

GraphNode.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

GraphNode.defaultProps = {
  colour: "#9C9C9C",
};

export default GraphNode;

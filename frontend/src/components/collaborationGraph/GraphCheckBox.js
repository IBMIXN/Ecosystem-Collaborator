function GraphCheckBox(props) {
  const d = `M ${props.x + 4.5} ${
    props.y + 8.5
  } l -2.085 -2.085 -0.7075 0.7075 2.7925 2.7925 6 -6 -0.7075 -0.7075 z`;
  return (
    <g onClick={props.handleCheck}>
      <rect
        className="custom-svg-checkbox"
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.width}
        rx="2px"
        data-checked={props.locked}
      ></rect>
      <path
        className="custom-svg-check"
        data-checked={props.locked}
        d={d}
      ></path>
    </g>
  );
}

export default GraphCheckBox;

const specs = ["Design", "Technical", "Marketing", "Sales"];

function GraphLines(props) {
  const lines = [[], [], [], []];

  function calculateLines() {
    props.data.forEach((company, row) => {
      specs.forEach((element, column) => {
        if (company.primarySpecifications.includes(element)) {
          lines[column].push(row);
        }
      });
    });
  }

  calculateLines();

  var svgLines = [];
  var count = 1;
  var opacity = "0.2";

  lines.forEach((column, colIndex) => {
    if (colIndex === lines.length - 1) {
      return;
    }
    column.forEach((node) => {
      lines[colIndex + 1].forEach((nextColNode, j) => {
        var begin = colIndex * 1 + "s";
        if (
          (colIndex === props.current["column"] &&
            node === props.current["row"]) ||
          (colIndex + 1 === props.current["column"] &&
            nextColNode === props.current["row"])
        ) {
          opacity = "0.5";
        } else {
          opacity = "0.2";
        }
        svgLines.push(
          <line
            key={count}
            x1={props.xcoords[colIndex]}
            y1={props.ycoords[node]}
            x2={props.xcoords[colIndex + 1]}
            y2={props.ycoords[nextColNode]}
            stroke="white"
            strokeDasharray="2000"
            strokeDashoffset="2000"
            strokeWidth="5"
            opacity={opacity}
          >
            <animate
              attributeType="CSS"
              attributeName="stroke-dashoffset"
              to="0"
              dur="2s"
              begin={begin}
              fill="freeze"
            />
          </line>
        );
        count = count + 1;
      });
    });
  });

  return svgLines;
}
export default GraphLines;

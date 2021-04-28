var temp = new Array(4).fill(200);
const xcoords = temp.map((item, index) => item + index * 150);
const nodeSize = "15";

const [ycoords_start, ycoords_gap] = [75, 75];
export { xcoords, nodeSize, ycoords_start, ycoords_gap };

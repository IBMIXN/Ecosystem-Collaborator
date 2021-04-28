import { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function SpecialisationRow2(props) {
  const labels = props.labels;
  const [status, setStatus] = useState(
    labels.map((item) => props.status.includes(item))
  );

  function handleCheck(e) {
    status[e.target.getAttribute("data-index")] = props.handleChange(e);
  }

  const newStatus = status.map((value, index) => value && props.enabled[index]);
  if (
    newStatus.filter((value, index) => status[index] === value).length !==
    newStatus.length
  ) {
    setStatus(newStatus);
  }

  return (
    <Form.Group as={Row} className="spec-check-group">
      {labels.map((input, index) => (
        <Form.Check
          checked={props.enabled[index] && status[index]}
          disabled={!props.enabled[index]}
          data-index={index}
          key={input}
          label={input}
          type="checkbox"
          onChange={(e) => {
            handleCheck(e);
          }}
        />
      ))}
    </Form.Group>
  );
}

export default SpecialisationRow2;

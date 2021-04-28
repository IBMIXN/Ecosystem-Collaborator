import { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function SpecialisationRow1(props) {
  const labels = props.labels;
  const [status, setStatus] = useState(
    labels.map((item) => props.status.includes(item))
  );
  const [required, setRequired] = useState(!status.includes(true));

  function handleCheck(e) {
    status[e.target.getAttribute("data-index")] = props.handleChange(e);
    setRequired(!status.includes(true));
  }

  const newStatus = status.map((value, index) => value && props.enabled[index]);
  if (
    newStatus.filter((value, index) => status[index] === value).length !==
    newStatus.length
  ) {
    setStatus(newStatus);
  }

  var errorMessage;
  if (props.validated) {
    if (!status.includes(true)) {
      errorMessage = (
        <Form.Text style={{ color: "#dc3545" }}>
          Please select at least one primary specialisation.
        </Form.Text>
      );
    }
  }

  return (
    <Form.Group as={Row} className="spec-check-group">
      {labels.map((input, index) => (
        <Form.Check
          required={required}
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
      {errorMessage}
    </Form.Group>
  );
}

export default SpecialisationRow1;

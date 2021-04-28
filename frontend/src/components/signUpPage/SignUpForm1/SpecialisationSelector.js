import SpecialisationRow1 from "./SpecialisationRow1.js";
import SpecialisationRow2 from "./SpecialisationRow2.js";

import { useState } from "react";
import { Form } from "react-bootstrap";

function SpecialisationSelector(props) {
  const formInput = props.formInput;
  const specLabels = ["Design", "Technical", "Marketing", "Sales"];
  const [primaryOptionStatus] = useState(
    specLabels.map((item) => formInput.primarySpec.includes(item))
  );
  const [secondaryOptionStatus] = useState(
    specLabels.map((item) => formInput.secondarySpec.includes(item))
  );

  const [primaryCount, setPrimaryCount] = useState(
    formInput.primarySpec.length
  );

  const [update, setUpdate] = useState(1);

  function forceUpdate() {
    setUpdate(update + 1);
  }

  const maxChecked = 2;

  function primarySpecChange(e) {
    var returnValue;
    if (e.target.checked === true) {
      if (primaryCount < maxChecked) {
        setPrimaryCount(primaryCount + 1);
        primaryOptionStatus[e.target.getAttribute("data-index")] = true;
        secondaryOptionStatus[e.target.getAttribute("data-index")] = false;
        returnValue = true;
      } else {
        e.target.checked = false;
        returnValue = false;
      }
    } else {
      setPrimaryCount(primaryCount - 1);
      primaryOptionStatus[e.target.getAttribute("data-index")] = false;
      returnValue = false;
    }
    formInput.primarySpec = specLabels.filter(
      (_, index) => primaryOptionStatus[index]
    );
    formInput.secondarySpec = specLabels.filter(
      (_, index) => secondaryOptionStatus[index]
    );
    return returnValue;
  }

  function secondarySpecChange(e) {
    secondaryOptionStatus[e.target.getAttribute("data-index")] =
      e.target.checked;
    formInput.secondarySpec = specLabels.filter(
      (_, index) => secondaryOptionStatus[index]
    );
    forceUpdate();
    return e.target.checked;
  }

  const primaryActive =
    primaryCount === maxChecked
      ? primaryOptionStatus
      : new Array(specLabels.length).fill(true);

  return (
    <Form.Group>
      <Form.Group>
        <Form.Label>Primary Specialisations</Form.Label>
        <SpecialisationRow1
          validated={props.validated}
          status={formInput.primarySpec}
          labels={specLabels}
          handleChange={primarySpecChange}
          enabled={primaryActive}
        />
        <Form.Text className="text-muted">
          You can only select up to 2 primary specialisations.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Secondary Specialisations </Form.Label>
        <SpecialisationRow2
          status={formInput.secondarySpec}
          labels={specLabels}
          handleChange={secondarySpecChange}
          enabled={primaryOptionStatus.map((item) => !item)}
        />
      </Form.Group>
    </Form.Group>
  );
}

export default SpecialisationSelector;

import IndustryDropdown from "./IndustryDropdown";

import { useState } from "react";
import { Form } from "react-bootstrap";
import IndustryDropdown2 from "./IndustryDropdown2";

function IndustrySelector(props) {
  const [removeFromSecondary, setRemoveFromSecondary] = useState(
    props.formInput.primaryIndustry
  );
  const [secondaryOptions, setSecondaryOptions] = useState([]);

  function primaryOptionsChanged(option) {
    props.formInput.primaryIndustry = option;
    setRemoveFromSecondary([...option]);

    const newSecondaryOptions = secondaryOptions.filter(
      (value) => !option.includes(value)
    );
    if (newSecondaryOptions.length !== secondaryOptions.length) {
      setSecondaryOptions(secondaryOptions);
      props.formInput.secondaryIndustry = newSecondaryOptions;
    }
  }

  function secondaryOptionsChanged(option) {
    props.formInput.secondaryIndustry = option;
    setSecondaryOptions(option);
  }

  function primaryOptionsCleared() {
    props.formInput.primaryIndustry = [];
    setRemoveFromSecondary([]);
  }

  function secondaryOptionsCleared() {
    props.formInput.secondaryIndustry = [];
  }

  return (
    <Form.Group>
      <Form.Group>
        <Form.Label>Primary Industries </Form.Label>
        <IndustryDropdown
          chosen={props.formInput.primaryIndustry}
          validated={props.validated}
          options={props.industries}
          optionsChanged={primaryOptionsChanged}
          optionsCleared={primaryOptionsCleared}
        />
      </Form.Group>
      <Form.Text className="text-muted">
        You can only select up to 5 primary industries.
      </Form.Text>
      <Form.Group>
        <Form.Label>Secondary Industries </Form.Label>
        <IndustryDropdown2
          chosen={props.formInput.secondaryIndustry}
          validated={props.validated}
          options={props.industries}
          remove={removeFromSecondary}
          optionsChanged={secondaryOptionsChanged}
          optionsCleared={secondaryOptionsCleared}
        />
      </Form.Group>
      <Form.Text className="text-muted">
        You can select unlimited secondary industries. Selecting "Any" indicates
        that you can work with all industries.
      </Form.Text>
    </Form.Group>
  );
}

export default IndustrySelector;

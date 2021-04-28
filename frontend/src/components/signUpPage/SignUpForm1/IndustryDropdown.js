import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Dropdown } from "semantic-ui-react";

const originalPlaceholder = "You can type to add your own options.";

function IndustryDropdown(props) {
  const [finalStartingOptions, setFinalStartingOptions] = useState(
    props.options
  );
  const [currentOptions, setOptions] = useState(props.options);
  const [currentValues, setValues] = useState(props.chosen);
  const [placeholder, setPlaceholder] = useState(originalPlaceholder);

  useEffect(() => {
    var startingOptions = props.options;
    var currentOptionsTemp = [...startingOptions];
    props.chosen.forEach((element) => {
      var custom = true;
      startingOptions.forEach((element2) => {
        if (element === element2.text) {
          custom = false;
        }
      });
      if (custom) {
        currentOptionsTemp = [
          { text: element, key: element, value: element },
          ...currentOptionsTemp,
        ];
      }
    });
    setFinalStartingOptions(startingOptions);
    setOptions(currentOptionsTemp);
  }, [props.options, props.chosen]);

  const handleAddition = (e, { value }) => {
    setOptions([{ text: value, key: value, value: value }, ...currentOptions]);
  };

  const handleChange = (e, { value: newValues }) => {
    if (newValues.length === 0) {
      if (props.optionsCleared !== undefined) {
        props.optionsCleared();
      }
      setOptions(finalStartingOptions);
      setPlaceholder(originalPlaceholder);
      setValues(newValues);
    } else if (newValues.length < currentValues.length) {
      // if value has been removed, check if removed value was custom
      // and filter it from current options.
      const removedValue = currentValues.filter(
        (value) => !newValues.includes(value)
      )[0];
      if (
        finalStartingOptions.filter((option) => option.value === removedValue)
          .length === 0
      ) {
        setOptions(
          currentOptions.filter((option) => option.value !== removedValue)
        );
        props.optionsChanged(
          currentOptions.filter((option) => option.value !== removedValue)
        );
      }
      setValues(newValues);
    } else if (newValues.length <= 5) {
      props.optionsChanged(newValues);
      setValues(newValues);
    }
  };
  var className = "";
  var errorMessage;
  if (props.validated) {
    if (props.chosen.length === 0) {
      className = "invalidChoice";
      errorMessage = (
        <Form.Text style={{ color: "#dc3545" }}>
          Please select at least one primary industry.
        </Form.Text>
      );
    } else {
      className = "validChoice";
    }
  }

  return (
    <div className="industry-dropdown-container">
      <Dropdown
        className={className}
        options={currentOptions}
        placeholder={placeholder}
        clearable
        search
        selection
        multiple
        scrolling
        allowAdditions
        value={currentValues}
        onAddItem={handleAddition}
        onChange={handleChange}
        noResultsMessage={null}
        fluid
      ></Dropdown>
      {errorMessage}
    </div>
  );
}

export default IndustryDropdown;

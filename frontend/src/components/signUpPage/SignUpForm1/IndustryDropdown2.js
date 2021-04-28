import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";

const originalPlaceholder = "You can type to add your own options.";

function IndustryDropdown2(props) {
  var placeholderTemp = originalPlaceholder;
  var allowSearchTemp = true;

  if (
    props.chosen.length > 0 &&
    props.chosen[props.chosen.length - 1] === "Any"
  ) {
    allowSearchTemp = false;
    placeholderTemp = "Any";
  }
  const [finalStartingOptions, setFinalStartingOptions] = useState([
    { text: "Any", value: "Any", key: "Any" },
    ...props.options,
  ]);
  const [currentOptions, setOptions] = useState([
    { text: "Any", value: "Any", key: "Any" },
    ...props.options,
  ]);
  const [currentValues, setValues] = useState(props.chosen);
  const [placeholder, setPlaceholder] = useState(placeholderTemp);
  const [allowSearch, setAllowSearch] = useState(allowSearchTemp);

  useEffect(() => {
    var startingOptions = props.options.filter(
      (value) => !props.remove.includes(value.value)
    );
    startingOptions = [
      { text: "Any", value: "Any", key: "Any" },
      ...startingOptions,
    ];
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
    // eslint-disable-next-line
  }, [props.options]);

  useEffect(() => {
    if (currentValues[0] !== "Any") {
      const newValues = currentValues.filter(
        (value) => !props.remove.includes(value)
      );
      if (newValues.length !== currentValues.length) {
        setValues(newValues);
      }

      var allOptions = new Set();
      finalStartingOptions.forEach((value) => allOptions.add(value.value));
      currentOptions.forEach((value) => allOptions.add(value.value));

      var allOptionsArray = Array.from(allOptions);

      const newOptions = allOptionsArray.filter(
        (value) => !props.remove.includes(value)
      );
      const formattedOptions = [];
      newOptions.forEach((option) => {
        formattedOptions.push({ key: option, text: option, value: option });
      });
      setOptions(formattedOptions);
    }
    // eslint-disable-next-line
  }, [props.remove]);

  const handleAddition = (e, { value }) => {
    if (props.remove.includes(value)) {
      return;
    }
    setOptions([{ text: value, key: value, value: value }, ...currentOptions]);
  };

  const handleChange = (e, { value: newValues }) => {
    // handle option of "Any" being selected
    if (newValues.length > 0 && newValues[newValues.length - 1] === "Any") {
      props.optionsChanged(["Any"]);
      setAllowSearch(false);
      setValues(["Any"]);
      setOptions([]);
      setPlaceholder("Any");
      return;
    }

    if (
      newValues.length > 0 &&
      props.remove.includes(newValues[newValues.length - 1])
    ) {
      return;
    }

    if (newValues.length === 0) {
      props.optionsCleared();
      setAllowSearch(true);
      setOptions(
        finalStartingOptions.filter(
          (value) => !props.remove.includes(value.value)
        )
      );
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
      } else if (props.optionsChanged !== undefined) {
        props.optionsChanged(newValues);
      }
      setValues(newValues);
    } else {
      props.optionsChanged(newValues);

      setValues(newValues);
    }
  };

  var className = "";
  if (props.validated) {
    className = "validChoice";
  }

  return (
    <div className="industry-dropdown-container">
      <Dropdown
        className={className}
        options={currentOptions}
        placeholder={placeholder}
        clearable
        search={allowSearch}
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
    </div>
  );
}

export default IndustryDropdown2;

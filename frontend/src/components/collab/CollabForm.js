import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";

function CollabForm(props) {
  const checkRequired = !props.status.includes(true);
  const [industries, setIndustries] = useState([
    { key: "Other", text: "Other", value: "Other" },
  ]);
  const [allowSearch, setAllowSearch] = useState(true);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    fetch("http://localhost:9000/industries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const formattedData = [];
        data.forEach((option) => {
          formattedData.push({ key: option, text: option, value: option });
        });
        formattedData.push({ key: "Other", text: "Other", value: "Other" });
        setIndustries(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e, { value: newValues }) => {
    if (newValues.includes("Other")) {
      props.setChosenIndustries(["Other"]);
      setAllowSearch(false);
      return;
    }
    props.setChosenIndustries(newValues);
    setAllowSearch(true);
  };

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    props.clearError();

    if (
      e.currentTarget.checkValidity() === false ||
      props.chosenIndustries.length === 0
    ) {
      setValidated(true);
      return;
    }

    setValidated(false);
    props.onSubmit();
  }

  const dropdownOptions = props.chosenIndustries.includes("Other")
    ? [{ key: "Other", text: "Other", value: "Other" }]
    : industries;

  var className = "";
  var errorMessage;
  if (validated) {
    if (props.chosenIndustries.length === 0) {
      className = "invalidChoice";
      errorMessage = (
        <Form.Text style={{ color: "#dc3545" }}>
          Please select at least one industry.
        </Form.Text>
      );
    } else {
      className = "validChoice";
    }
  }

  var serverErrorMessage;
  if (props.error) {
    serverErrorMessage = (
      <Row>
        <Form.Text
          style={{ marginLeft: "auto", marginRight: "auto", color: "#dc3545" }}
        >
          Error: Failed to search.
        </Form.Text>
      </Row>
    );
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Label> Specialisations Required </Form.Label>
      <Form.Group as={Row} className="collab-check-group">
        {props.labels.map((input, index) => (
          <Form.Check
            required={checkRequired}
            checked={props.status[index]}
            data-index={index}
            key={input}
            label={input}
            type="checkbox"
            onChange={(e) => props.handleCheck(e)}
            style={{ marginLeft: "20px" }}
          />
        ))}
      </Form.Group>
      <Form.Label> Project Industries </Form.Label>
      <div
        className="industry-dropdown-container"
        style={{ marginBottom: "20px" }}
      >
        <Dropdown
          className={className}
          options={dropdownOptions}
          placeholder={"If none are applicable, choose 'Other'."}
          clearable
          search={allowSearch}
          selection
          multiple
          scrolling
          value={props.chosenIndustries}
          onChange={handleChange}
          noResultsMessage={null}
          fluid
        ></Dropdown>
        {errorMessage}
        <Form.Text className="text-muted">
          Select all industries that apply. If none are applicable, choose
          'Other'.
        </Form.Text>
      </div>
      <Form.Label> Project Description </Form.Label>
      <Form.Control
        required
        onChange={(e) => props.setDescription(e.target.value)}
        placeholder="Description"
        as="textarea"
      />
      <Button disabled={props.loading} className="collab-submit" type="submit">
        Submit
      </Button>
      {serverErrorMessage}
    </Form>
  );
}

export default CollabForm;

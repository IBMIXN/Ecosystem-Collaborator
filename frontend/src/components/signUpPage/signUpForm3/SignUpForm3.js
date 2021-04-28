import { useState } from "react";
import { Button, Form, Row, Spinner } from "react-bootstrap";

function SignUpForm3(props) {
  const formInput = props.formInput;
  const [validated, setValidated] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("waiting");

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setSubmitStatus("submiting");
    const body = JSON.stringify({
      companyName: formInput.companyName,
      primarySpecifications: formInput.primarySpec,
      secondarySpecifications: formInput.secondarySpec,
      PrimaryIndustries: formInput.primaryIndustry,
      SecondaryIndustries:
        formInput.secondaryIndustry.length > 0
          ? formInput.secondaryIndustry
          : [""],
      companyDescription: formInput.companyDescription,
      industryDescriptions: formInput.industryDescriptions,
      industryLinks: formInput.industryLinks,
      companyURL: formInput.companyURL,
      companyEmail: formInput.companyEmail,
    });

    fetch("http://localhost:9000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.text();
      })
      .then((data) => {
        console.log(data);
        props.onSuccess();
      })
      .catch((err) => {
        setSubmitStatus("error");
        console.log(err);
      });
  }

  var submitButton;
  if (submitStatus === "waiting" || submitStatus === "error") {
    submitButton = (
      <Button
        type="submit"
        style={{
          marginLeft: "auto",
        }}
      >
        Submit
      </Button>
    );
  } else if (submitStatus === "submiting") {
    submitButton = <Spinner animation="border" variant="primary" />;
  } else {
    submitButton = (
      <div style={{ color: "#3500D3", alignSelf: "center", fontSize: "20px" }}>
        &#10003;
      </div>
    );
  }

  var errorMessage;
  if (submitStatus === "error") {
    errorMessage = (
      <Row>
        <Form.Text
          style={{ marginLeft: "auto", marginRight: "auto", color: "#dc3545" }}
        >
          Error: Failed to submit.
        </Form.Text>
      </Row>
    );
  }
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Company Website</Form.Label>
        <Form.Control
          defaultValue={formInput.companyURL}
          className="short-input"
          required
          onChange={(e) => {
            formInput.companyURL = e.target.value;
          }}
          placeholder="company.com"
        />
        <Form.Control.Feedback type="invalid">
          Please enter the company website.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          defaultValue={formInput.companyEmail}
          className="short-input"
          required
          onChange={(e) => {
            formInput.companyEmail = e.target.value;
          }}
          placeholder="company@company.com"
        />
        <Form.Control.Feedback type="invalid">
          Please enter the company email address.
        </Form.Control.Feedback>
      </Form.Group>

      <div
        style={{
          display: "flex",
        }}
      >
        <Button
          onClick={props.previousPage}
          style={{
            backgroundColor: "#3500D3",
            marginRight: "auto",
            color: "white",
            borderColor: "#3500D3",
          }}
        >
          Previous
        </Button>
        {submitButton}
      </div>
      {errorMessage}
    </Form>
  );
}

export default SignUpForm3;

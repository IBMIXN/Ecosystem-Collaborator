import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import IndustryDescriptions from "./IndustryDescriptions";

function SignUpForm2(props) {
  const industryDescriptions = props.industryDescriptions;
  const industryLinks = props.industryLinks;
  const primaryIndustry = props.primaryIndustry;
  const [validated, setValidated] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.checkValidity() === false) {
      setValidated(true);
      return;
    }
    props.nextPage();
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <IndustryDescriptions
        primaryIndustry={primaryIndustry}
        industryDescriptions={industryDescriptions}
        industryLinks={industryLinks}
      />
      <div
        style={{
          display: "flex",
        }}
      >
        <Button onClick={props.previousPage}>Previous</Button>
        <Button
          type="submit"
          style={{
            marginLeft: "auto",
          }}
        >
          Next
        </Button>
      </div>
    </Form>
  );
}

export default SignUpForm2;

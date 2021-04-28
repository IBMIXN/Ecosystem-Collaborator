import IndustrySelector from "./IndustrySelector";
import "./SignUpForm1.css";
import { Button, Form } from "react-bootstrap";
import SpecialisationSelector from "./SpecialisationSelector";
import { useState } from "react";

function SignUpForm1(props) {
  const formInput = props.formInput;
  const [validated, setValidated] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.currentTarget.checkValidity() === false ||
      formInput.primaryIndustry.length === 0
    ) {
      setValidated(true);
      return;
    }
    props.nextPage();
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Company Name</Form.Label>
        <Form.Control
          defaultValue={formInput.companyName}
          className="short-input"
          required
          onChange={(e) => {
            formInput.companyName = e.target.value;
          }}
          placeholder="Company"
        />
        <Form.Control.Feedback type="invalid">
          Please enter the company name.
        </Form.Control.Feedback>
      </Form.Group>

      <SpecialisationSelector formInput={formInput} validated={validated} />
      <br></br>
      <IndustrySelector
        validated={validated}
        formInput={formInput}
        industries={props.industries}
      />
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          defaultValue={formInput.companyDescription}
          required
          as="textarea"
          placeholder="Description"
          onChange={(e) => {
            formInput.companyDescription = e.target.value;
          }}
        />
        <Form.Control.Feedback type="invalid">
          Please enter a description of the company.
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Here you can describe your company's specialisations. For example,
          your company may specialise in creating cloud computing solutions
          within the "Technical" category.
        </Form.Text>
      </Form.Group>

      <div className="form-next-page-button">
        <Button type="submit">Next</Button>
      </div>
    </Form>
  );
}

export default SignUpForm1;

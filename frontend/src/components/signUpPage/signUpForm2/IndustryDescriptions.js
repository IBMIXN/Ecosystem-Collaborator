import { useState } from "react";
import Form from "react-bootstrap/Form";
import IndustryLink from "./IndustryLink";

function IndustryDescriptions(props) {
  const industryDescriptions = props.industryDescriptions;
  const [industryLinks, setIndustryLinks] = useState({
    ...props.industryLinks,
  });

  function handleLinkInput(text, industry) {
    industryLinks[industry] = text;
    props.industryLinks[industry] = text;
  }

  function handleToggle(isOn, industry) {
    if (isOn) {
      industryLinks[industry] = "";
      props.industryLinks[industry] = "";
    } else {
      delete industryLinks[industry];
      delete props.industryLinks[industry];
    }
    setIndustryLinks({ ...industryLinks });
  }

  const a = props.primaryIndustry.map((industry, index) => (
    <Form.Group key={index}>
      <div>
        <Form.Label>Describe Work in the {industry} Industry</Form.Label>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Form.Label
            style={{
              paddingRight: "5px",
            }}
          >
            Include link
          </Form.Label>
          <Form.Check
            type="switch"
            id={index + 1}
            defaultChecked={props.industryLinks[industry]}
            onChange={(e) => {
              handleToggle(e.target.checked, industry);
            }}
          />
        </div>
      </div>

      <Form.Control
        style={{ marginBottom: "10px" }}
        required
        defaultValue={industryDescriptions[industry]}
        as="textarea"
        placeholder="Description"
        onChange={(e) => {
          industryDescriptions[industry] = e.target.value;
        }}
      />
      <Form.Control.Feedback type="invalid">
        Please provide a description of your work in this industry.
      </Form.Control.Feedback>
      <IndustryLink
        industryLinks={props.industryLinks}
        industry={industry}
        handleLinkInput={handleLinkInput}
      />
    </Form.Group>
  ));

  return a;
}

export default IndustryDescriptions;

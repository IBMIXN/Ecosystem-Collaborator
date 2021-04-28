import Form from "react-bootstrap/Form";
function IndustryLink(props) {
  var form;
  if (props.industryLinks[props.industry] !== undefined) {
    form = (
      <Form.Group>
        <Form.Control
          required
          placeholder="Link"
          defaultValue={props.industryLinks[props.industry]}
          onChange={(e) => {
            props.handleLinkInput(e.target.value, props.industry);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Please provide a link to your work in this industry.
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  return <div>{form}</div>;
}

export default IndustryLink;

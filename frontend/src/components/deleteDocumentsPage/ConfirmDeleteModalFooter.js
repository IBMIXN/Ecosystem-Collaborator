import { Button, Modal, Spinner} from 'react-bootstrap';

function ConfirmDeleteModalFooter(props) {
  var footer;
  if (props.deleting === "waiting") {
    footer = 
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.setShow(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={props.deleteDocument}>
        Delete
      </Button>
    </Modal.Footer>;
  } else if (props.deleting === "deleting") {
    footer =
    <Modal.Footer>
      <Spinner animation="border"/>
    </Modal.Footer>;
  } else if (props.deleting === "confirmation") {
    footer =
    <Modal.Footer>
      &#10003;
    </Modal.Footer>;
  };
  

  return (footer);
};

export default ConfirmDeleteModalFooter;
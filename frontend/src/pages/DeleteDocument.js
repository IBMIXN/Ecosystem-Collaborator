import MyNavbar from "../components/MyNavbar";
import ConfirmDeleteModal from "../components/deleteDocumentsPage/ConfirmDeleteModal";
import { Button, Col, Container, Row } from "react-bootstrap";
import ListOfDocuments from "../components/deleteDocumentsPage/listOfDocuments";
import { useState } from "react";

function DeleteDocument() {
  const [show, setShow] = useState(false);
  const [documentsSelected, setDocumentsSelected] = useState([]);
  const [documentsDeleted, setDocumentsDeleted] = useState(0);

  function successfullyDeleted() {
    setDocumentsDeleted(documentsDeleted + 1);
    setDocumentsSelected([]);
  }

  function handleDelete(document) {
    setShow(true);
  }

  function handleCheck(document, isChecked) {
    if (isChecked) {
      setDocumentsSelected([document, ...documentsSelected]);
    } else {
      setDocumentsSelected(
        documentsSelected.filter((doc) => doc.id !== document.id)
      );
    }
  }

  return (
    <>
      <div className="body">
        <MyNavbar />
        <Container
          style={{
            height: "100%",
            padding: "10px",
          }}
        >
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h1>Delete Documents</h1>
            </Col>
          </Row>
          <ListOfDocuments
            documentsDeleted={documentsDeleted}
            handleDelete={handleDelete}
            handleCheck={handleCheck}
          />
          <Button
            variant="danger"
            onClick={handleDelete}
            style={{ margin: "5px" }}
            disabled={documentsSelected.length === 0}
          >
            Delete
          </Button>
        </Container>
      </div>

      <ConfirmDeleteModal
        documents={documentsSelected}
        show={show}
        setShow={setShow}
        successfullyDeleted={successfullyDeleted}
      />
    </>
  );
}

export default DeleteDocument;

import { Col, Container, Modal, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ConfirmDeleteModalFooter from './ConfirmDeleteModalFooter';

function ConfirmDeleteModal(props) {
  const [deleting, setDeleting] = useState("waiting");
  
  useEffect(() => {
    if (deleting === "confirmation") {
      setTimeout(() => {
        props.setShow(false);
        setTimeout(() => {
          setDeleting("waiting");
        }, 500);
      }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleting]);


  function deleteDocument() {
    setDeleting("deleting");
    for (let i = 0; i < props.documents.length; i++) {
      var url = "http://localhost:9000/document/" + props.documents[i].id; 
      fetch(url, {
        method: 'DELETE',
      })
      .then((res) => {
        if (!res.ok) {
          throw res.text()
        }
        return res.text();
      })
      .then((data) => {
        console.log(data);
        if (i === props.documents.length -1) {
          setDeleting("confirmation");
          props.successfullyDeleted();
        }
        // setDeleting("confirmation");
        // props.successfullyDeleted();
      })
      .catch((err) => {
        err.then((data) => console.log(data))
      })
    };
    
    // var url = "http://localhost:9000/document/" + props.documentID; 
    // fetch(url, {
    //   method: 'DELETE',
    // })
    // .then((res) => {
    //   if (!res.ok) {
    //     throw res.text()
    //   }
    //   return res.text();
    // })
    // .then((data) => {
    //   console.log(data);
    //   setDeleting("confirmation");
    //   props.successfullyDeleted();
    // })
    // .catch((err) => {
    //   err.then((data) => console.log(data))
    // })
  };

  return (
      <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the following documents?
          <Container>
            {props.documents.map((doc, index) =>
            <Row key={index}>
              <Col xs={3}>
                {doc.companyName}
              </Col>
              <Col xs={9}>
                {doc.id}
              </Col>
            </Row>)}
          </Container>
        </Modal.Body>
        <ConfirmDeleteModalFooter setShow={props.setShow} deleting={deleting} deleteDocument={deleteDocument}/>
      </Modal>
  );
};

export default ConfirmDeleteModal;
import { Col, Form, Pagination, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

function ListOfDocuments(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfDocs, setNumberOfDocs] = useState();
  const [pageResults, setPageResults] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const offset = (currentPage - 1) * 10;
    var url = "http://localhost:9000/document/" + offset;
    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setNumberOfDocs(data.matching_results);
        setPageResults(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage, props.documentsDeleted]);

  let items = [];
  for (let number = 1; number <= Math.ceil(numberOfDocs / 10); number++) {
    items.push(
      <Pagination.Item
        onClick={() => setCurrentPage(number)}
        key={number}
        active={number === currentPage}
      >
        {number}
      </Pagination.Item>
    );
  }

  const paginationBasic = <Pagination>{items}</Pagination>;

  var results, header;

  if (loading) {
    results = <Spinner animation="border" />;
    header = <div />;
  } else {
    results = pageResults.map((input, index) => (
      <Row key={index}>
        <Col xs={3}>{input.companyName}</Col>
        <Col xs={6}>{input.id}</Col>
        <Col>
          <Form.Check
            type="checkbox"
            onChange={(e) => props.handleCheck(input, e.target.checked)}
          />
        </Col>
      </Row>
    ));
    header = (
      <Row style={{ paddingBottom: "5px" }}>
        <Col xs={3}>Company Name</Col>
        <Col xs={6}>Document ID</Col>
        <Col xs={3}>Select</Col>
      </Row>
    );
  }

  return (
    <div>
      {header}
      {results}
      {paginationBasic}
    </div>
  );
}

export default ListOfDocuments;

import MyNavbar from "../components/MyNavbar";
import { Button, Col, Row } from "react-bootstrap";
import { useState } from "react";
import Graph from "../components/collaborationGraph/Graph";
import "./Collab.css";
import CollabPagination from "../components/collab/CollabPagination";
import CollabForm from "../components/collab/CollabForm";
import CompanyTabs from "../components/collab/CompanyTabs";
import TierTooltip from "../components/collab/TierTooltip";

const resultsPerPageOptions = [5, 10, 20];

function Collab() {
  const specLabels = ["Design", "Technical", "Marketing", "Sales"];
  const [description, setDescription] = useState("healthcare");
  const [specStatus, setSpecStatus] = useState(specLabels.map((_) => false));
  const [industries, setIndustries] = useState([]);
  const [data, setData] = useState();
  const [totalResults, setTotalResults] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    resultsPerPageOptions[0]
  );
  const [lockedData, setLockedData] = useState([]);
  const [lockedStatus, setLockedStatus] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();

  function handleCheck(e) {
    const labelIndex = e.target.getAttribute("data-index");
    setSpecStatus(
      specStatus.map((item, index) =>
        // eslint-disable-next-line
        index == labelIndex ? e.target.checked : item
      )
    );
  }

  function onSubmit() {
    setCurrentPage(1);
    setTotalResults();
    setLockedData([]);
    setLockedStatus([]);
    setSelectedCompany();
    setError(false);
    fetchData(1, resultsPerPage);
  }

  function fetchData(page, resultsPerPage) {
    setError(false);
    setLoading(true);
    setData();
    var specifications = specLabels.filter((_, index) => specStatus[index]);
    const params = new URLSearchParams({
      query: description,
      specifications: specifications,
      industries: industries,
      limit: resultsPerPage,
      offset: (page - 1) * resultsPerPage,
    });

    fetch("http://localhost:9000/search?" + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data.data);
        setTotalResults(data.matching_results);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(true);
      });
  }

  function handleSetLockedData(newData) {
    if (!selectedCompany) {
      setLockedData(newData);
      return;
    }
    var lockedContainsSelected = false;
    newData.some((item) => {
      if (item.id === selectedCompany.id) {
        lockedContainsSelected = true;
        return true;
      }
      return false;
    });
    if (lockedContainsSelected) {
      setSelectedCompany();
    }
    setLockedData(newData);
  }

  function handleSetSelectedCompany(newCompany) {
    var lockedContainsSelected = false;
    lockedData.some((item) => {
      if (item.id === newCompany.id) {
        lockedContainsSelected = true;
        return true;
      }
      return false;
    });
    if (!lockedContainsSelected) {
      setSelectedCompany(newCompany);
    }
  }

  var companyTagsData;
  if (selectedCompany) {
    companyTagsData = [selectedCompany, ...lockedData];
  } else {
    companyTagsData = lockedData;
  }

  return (
    <div className="body">
      <MyNavbar />
      <h1>Collaborate</h1>
      <Row>
        <Col xs={3} />
        <Col xs={6} className="collab-form-container">
          <CollabForm
            labels={specLabels}
            chosenIndustries={industries}
            setChosenIndustries={setIndustries}
            handleCheck={handleCheck}
            onSubmit={onSubmit}
            status={specStatus}
            setDescription={setDescription}
            loading={loading}
            error={error}
            clearError={() => setError(false)}
          />
        </Col>
      </Row>

      <p style={{ display: totalResults ? "block" : "none" }}>
        Found {totalResults} matching results
      </p>
      <div
        className="results-per-page-container"
        style={{ display: data ? "flex" : "none" }}
      >
        <div className="tier-tooltip">
          <TierTooltip />
        </div>

        <div>
          Results per page:
          {resultsPerPageOptions.map((option, index) => (
            <Button
              className="results-per-page-button"
              key={index}
              variant={option === resultsPerPage ? "primary" : "secondary"}
              onClick={() => {
                setResultsPerPage(option);
                setCurrentPage(1);
                fetchData(1, option);
              }}
            >
              {option === 0 ? "All Time" : option}
            </Button>
          ))}
        </div>
      </div>

      <Graph
        loading={loading}
        data={data}
        totalResults={totalResults}
        currentPage={currentPage}
        lockedData={lockedData}
        setLockedData={handleSetLockedData}
        lockedStatus={lockedStatus}
        setLockedStatus={setLockedStatus}
        setSelectedCompany={handleSetSelectedCompany}
      />
      <div className="graph-pagination-container">
        <CollabPagination
          resultsPerPage={resultsPerPage}
          setCurrentPage={(newPageNo) => {
            setCurrentPage(newPageNo);
            fetchData(newPageNo, resultsPerPage);
          }}
          currentPage={currentPage}
          numberOfResults={totalResults}
          loading={loading}
        />
      </div>
      <CompanyTabs data={companyTagsData} loaded={data} />
    </div>
  );
}

export default Collab;

import { Col, Row } from "react-bootstrap";

const specs = ["Design", "Technical", "Marketing", "Sales"];

function CompanyInfo(props) {
  const company = props.company;

  function industryLink(link) {
    return (
      <p>
        {"Find out more "}
        <a href={link} target="_blank" rel="noreferrer">
          here
        </a>
        .
      </p>
    );
  }

  function formatSecondaryIndustries() {
    if (
      company.SecondaryIndustries[0] === "" &&
      company.SecondaryIndustries.length === 1
    ) {
      return <div></div>;
    } else if (company.SecondaryIndustries[0] === "Any") {
      return (
        <div>
          <h2>Secondary Industries</h2>
          <p>This company is able to work with all industries.</p>
        </div>
      );
    }
    return (
      <div>
        <h2>Secondary Industries</h2>
        {company.SecondaryIndustries.map((item, index) => (
          <h3 key={index}>{item}</h3>
        ))}
      </div>
    );
  }

  return (
    <div className="company-info-container">
      <a href={company.companyURL} target="_blank" rel="noreferrer">
        <h1>{company.companyName}</h1>
      </a>
      <p>{company.companyDescription}</p>
      <span>
        <Row>
          {specs.map((item, index) => (
            <Col key={index}>{item}</Col>
          ))}
        </Row>
      </span>

      <Row>
        {specs.map((item, index) => (
          <Col key={index}>
            <span>
              {company.primarySpecifications.includes(item) ||
              company.secondarySpecifications.includes(item)
                ? "✓"
                : ""}
            </span>
          </Col>
        ))}
      </Row>
      <Row>
        {specs.map((item, index) => (
          <Col key={index}>
            <span style={{ color: "grey" }}>
              {company.primarySpecifications.includes(item)
                ? "Primary"
                : company.secondarySpecifications.includes(item)
                ? "Secondary"
                : ""}
            </span>
          </Col>
        ))}
      </Row>
      <h2>Primary Industries</h2>
      {company.PrimaryIndustries.map((item, index) => (
        <div key={index}>
          <h3>{item}</h3>
          <p>
            {company.industryDescriptions[item]}
            {company.industryLinks[item]
              ? industryLink(company.industryLinks[item])
              : ""}
          </p>
        </div>
      ))}
      {formatSecondaryIndustries()}
    </div>
  );
}

export default CompanyInfo;

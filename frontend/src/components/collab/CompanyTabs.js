import CompanyInfo from "./CompanyInfo";
import { Tabs, Tab } from "react-bootstrap";

function CompanyTabs(props) {
  if (!props.loaded) {
    return <div></div>;
  }

  if (props.data.length === 0) {
    return (
      <Tabs activeKey="home" id="info-tab">
        <Tab eventKey="home" title="Select Company" disabled>
          <div>
            Click on a Company's name or lock a Company to view their profile.
          </div>
        </Tab>
      </Tabs>
    );
  }

  return (
    <Tabs defaultActiveKey="0">
      <Tab eventKey="hide" title="Hide"></Tab>
      {props.data.map((data, index) => (
        <Tab key={index} eventKey={index} title={data.companyName}>
          <CompanyInfo company={data} />
        </Tab>
      ))}
    </Tabs>
  );
}

export default CompanyTabs;

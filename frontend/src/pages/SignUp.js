import MyNavbar from "../components/MyNavbar";
import SignUpForm1 from "../components/signUpPage/SignUpForm1/SignUpForm1";
import SignUpForm2 from "../components/signUpPage/signUpForm2/SignUpForm2";
import SignUpForm3 from "../components/signUpPage/signUpForm3/SignUpForm3";
import "./SignUp.css";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";

function SignUp() {
  const [industries, setIndustries] = useState([]);
  const [formInput] = useState({
    companyName: "",
    primarySpec: [],
    secondarySpec: [],
    primaryIndustry: [],
    secondaryIndustry: [],
    companyDescription: "",
    industryDescriptions: {},
    industryLinks: {},
    companyURL: "https://www.ibm.com",
    companyEmail: "support@IBM.com",
  });

  const [showPriIndustryErr, setShowPriIndustryErr] = useState();
  const [page, setPage] = useState(1);

  function form2fromForm1() {
    var newDescription = {};
    formInput.primaryIndustry.forEach((item) => {
      newDescription[item] = formInput.industryDescriptions[item]
        ? formInput.industryDescriptions[item]
        : "";
    });
    formInput.industryDescriptions = newDescription;
    var newLinks = {};
    formInput.primaryIndustry.forEach((item) => {
      if (formInput.industryLinks[item]) {
        newLinks[item] = formInput.industryLinks[item];
      }
    });
    formInput.industryLinks = newLinks;
    setPage(2);
  }

  useEffect(() => {
    fetch("http://localhost:9000/industries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const formattedData = [];
        data.forEach((option) => {
          formattedData.push({ key: option, text: option, value: option });
        });
        setIndustries(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (showPriIndustryErr === undefined) {
      return;
    }
    setShowPriIndustryErr(formInput.primaryIndustry.length === 0);
  }, [formInput.primaryIndustry]); // eslint-disable-line react-hooks/exhaustive-deps

  var form;
  if (page === 1) {
    form = (
      <SignUpForm1
        formInput={formInput}
        nextPage={form2fromForm1}
        industries={industries}
      />
    );
  } else if (page === 2) {
    form = (
      <SignUpForm2
        primaryIndustry={formInput.primaryIndustry}
        industryDescriptions={formInput.industryDescriptions}
        industryLinks={formInput.industryLinks}
        nextPage={() => setPage(3)}
        previousPage={() => setPage(1)}
      />
    );
  } else if (page === 3) {
    form = (
      <SignUpForm3
        previousPage={() => setPage(2)}
        formInput={formInput}
        onSuccess={() => setPage(4)}
      />
    );
  } else if (page === 4) {
    form = (
      <div
        style={{
          fontSize: "30px",
          alignSelf: "center",
          height: "75%",
        }}
      >
        Sign up Successfull!
      </div>
    );
  }

  return (
    <div className="body">
      <MyNavbar />
      <h1>Welcome to Ecosystem Collaboration Tool</h1>
      <div className="signup-form-container">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="signup-form">
          {form}
        </Col>
      </div>
    </div>
  );
}

export default SignUp;

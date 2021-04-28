import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import "./Home.css";

function App() {
  return (
    <div className="body">
      <MyNavbar />
      <h1>Welcome!</h1>
      <p>This is a platform for aiding collaboration.</p>
      <div className="home-buttons-container">
        <Link to="/collab">
          <Button className="home-button">Let's start collaborating!</Button>
        </Link>
        <Link to="/signup">
          <Button className="home-button">Sign me up!</Button>
        </Link>
      </div>
    </div>
  );
}

export default App;

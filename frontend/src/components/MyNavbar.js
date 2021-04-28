import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, NavLink } from "react-router-dom";

function MyNavbar() {
  return (
    <Navbar style={{ backgroundColor: "#3500d3" }} expand="lg">
      <Link to="/">
        <Navbar.Brand style={{ color: "white" }}>
          Ecosystem Collaboration Tool
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink
            to="/"
            style={{ padding: "5px", margin: "auto", color: "black" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/collab"
            style={{ padding: "5px", margin: "auto", color: "black" }}
          >
            Collaborate
          </NavLink>
          <NavLink
            to="/withdraw"
            style={{ padding: "5px", margin: "auto", color: "black" }}
          >
            Delete Documents
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default MyNavbar;

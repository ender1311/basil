// src/components/AppNavbar.js
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
import "./AppNavbar.css";
//import bootstrap css
// import "bootstrap/dist/css/bootstrap.min.css";

export function AppNavbar() {
  const navigate = useNavigate();

  const onSuccess = (response) => {
    console.log("Login Success:", response.profileObj);
    localStorage.setItem("userData", JSON.stringify(response.profileObj));
    navigate("/");
  };

  const onFailure = (response) => {
    console.log("Login Failed:", response);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem("userData") !== null;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Link to="/" className="navbar-brand">
        <img src="/Basil_Logo_only.png" alt="Basil Logo" className="logo" />
        <p className="brand-text">BASIL</p>
      </Link>
      <Nav className="ml-auto custom-nav">
        <Nav.Link as={Link} to="/">
          View Recipes
        </Nav.Link>
        <Nav.Link as={Link} to="/add-recipe-url">
          Add Recipe (URL)
        </Nav.Link>
        <Nav.Link as={Link} to="/copy-recipe">
          Copy Recipe
        </Nav.Link>
        <Nav.Link as={Link} to="/grocery-list">
          Grocery List
        </Nav.Link>
        <Nav.Link as={Link} to="/kroger">
          Kroger
        </Nav.Link>
        {isUserLoggedIn() ? (
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={handleLogout}
          />
        ) : (
          <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
          />
        )}
      </Nav>
    </Navbar>
  );
}

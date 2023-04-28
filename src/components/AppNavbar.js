import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavbarStyles.css"


export function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">Basil</Navbar.Brand>
      <Nav className="ml-auto">
        
      
        <Nav.Link as={Link} to="/">Recipes</Nav.Link>
        <Nav.Link as={Link} to="/grocery-list">Grocery List</Nav.Link>
        <Nav.Link as={Link} to="/kroger">Kroger</Nav.Link>
      </Nav>
    </Navbar>
  );
}

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';

function NavBar({isLoggedIn}) { //this is bootstrap code, that i have customized to fit my website
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">tunedin today</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn?(
                <>
                    <Nav.Link as={Link} to="/add-song">add today's song</Nav.Link>
                    <NavDropdown title="Profile" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">see playlists</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings">settings</NavDropdown.Item>
                    </NavDropdown>
                </>
            ):(
                <>
                    <Nav.Link as={Link} to="/login">login</Nav.Link>
                    <Nav.Link as={Link} to="/register">register</Nav.Link>
                </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
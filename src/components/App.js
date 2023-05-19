import { Outlet, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function App() {

  return (
    <div>
        <header>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="fixed-top">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Volley App</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer to="/players">
                    <Nav.Link>Players</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/events">
                    <Nav.Link>Events</Nav.Link>
                  </LinkContainer>
                  <NavDropdown title="Other" id="collasible-nav-dropdown">
                    <LinkContainer to="/league">
                      <NavDropdown.Item>League Schedule</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/scheduler">
                      <NavDropdown.Item>Day Schedule</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/rotation">
                      <NavDropdown.Item>Schedule Generator [DEAD]</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div style={{height: "55px"}}></div>
        <Outlet />
    </div>
  );
}

export default App;

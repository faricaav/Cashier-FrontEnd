import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../profile.css'

function Header() {
    let nama_user = localStorage.getItem('nama_user')
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto text-end">
              <Nav.Link eventKey={2} href="#memes">
                  <figure className="shadow-md">
                      {nama_user.charAt(0).toUpperCase()}
                  </figure>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Header;
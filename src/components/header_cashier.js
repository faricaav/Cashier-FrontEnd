import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import '../profile.css'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HeaderCashier() {
    let nama_user = localStorage.getItem('nama_user')
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto text-end">
            <Link eventKey={2} to="/cart" className='mt-3 mx-4'>
                <FontAwesomeIcon icon={faCartShopping}/>
              </Link>
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

export default HeaderCashier;
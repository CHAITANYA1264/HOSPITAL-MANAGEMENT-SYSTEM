import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../Assets/Logo.png";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavDropdown from "react-bootstrap/NavDropdown";
const notify = (text) => toast(text);

function NavBars() {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="navStick">
      <ToastContainer />
      <Navbar expand="lg">
        <Container fluid>
          {/* ✅ Logo navigates inside app (home page) */}
          <div
            className="navbar-brand"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              title="logo"
              alt="MediLink Logo"
              style={{ height: "50px" }}
            />
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/ourteam" className="nav-link">
                Doctors
              </Link>

              {/* ✅ "About Us" is now a simple link instead of a dropdown */}
              <Link to="/service" className="nav-link">
                Services
              </Link>

              <Link to="/booking" className="nav-link">
                Booking
              </Link>

              {data?.isAuthenticated ? (
                <Link
                  to=""
                  className="nav-link"
                  onClick={() => {
                    dispatch({ type: "AUTH_LOGOUT" });
                    notify("Logged out");
                  }}
                >
                  Logout
                </Link>
              ) : (
                <NavDropdown title="Login" id="basic-nav-dropdown">
                  <Link to="/login" className="dropdown-item">
                    Patient
                  </Link>
                  <a
                    href="http://localhost:3000/"
                    className="dropdown-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Staff
                  </a>
                </NavDropdown>
              )}

              <Link to="/Report" className="nav-link">
                <button type="button">
                  Report
                  <span>
                    <IoIosArrowForward />
                  </span>
                </button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBars;

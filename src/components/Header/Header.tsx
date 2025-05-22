import Image from "next/image"
import Link from "next/link"
import React, { useContext } from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import logo from "../../../public/images/PGStacked2019d.png"
import styles from "../../../styles/Home.module.scss"
import GlobalContext from "../../context/GlobalContext"
import Login from "../Login"

const Header = (props: any) => {
  const gContext = useContext(GlobalContext)

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>
          <Link href="/">
            <span className={styles.logo}>
              <Image src={logo} alt="Perfect Game" width={200} height={50} />
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link href="/players" legacyBehavior>
              <Nav.Link href="/players" className={styles.navLink}>
                Players
              </Nav.Link>
            </Link>
            {/* <Link href="/profile" legacyBehavior>
                <Nav.Link href="/profile" className={styles.navLink}>
                  Player Profile
                </Nav.Link>
              </Link> */}
            <Nav.Link href="#spray-chart" className={styles.navLink}>
              Spray Chart
            </Nav.Link>
            <Nav.Link href="#stats" className={styles.navLink}>
              Advanced Stats
            </Nav.Link>
            <NavDropdown
              title="Links"
              id="collapsible-nav-dropdown"
              className={styles.navLink}
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
export default Header

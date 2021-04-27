import React from 'react';
import { Nav, Navbar} from 'react-bootstrap';
import firebase from "firebase/app";
import styled from 'styled-components';
const Styles = styled.div`
  .navbar { background-color: #fff; width:95%; margin-left:5%;}
  a, .navbar-nav, .navbar-light .nav-link {
    color: #00a7a7;
    &:hover { color: white; }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #00a7a7;
    &:hover { color: white; }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
`;



const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      console("signed out");
    })
    .catch(function (error) {
      // An error happened.
    });
};


export const NavigationBar = () => (
  <Styles>
    <Navbar expand="lg">
      {/* <Navbar.Brand href="/">Achieve Now</Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      {/* <Form className="form-center">
        <FormControl type="text" placeholder="Search" className="" />
      </Form> */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item> 
          <Nav.Item><Nav.Link href="/" onClick={signOut}>Logout</Nav.Link></Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </Styles>
)
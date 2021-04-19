import React, { Component } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBContainer,
MDBHamburgerToggler } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';

const NavbarPage = () => {
    const [state,setState] = React.useState({collapse:false,collapseID:''})


const toggleCollapse = collapseID => () => {
  setState(prevState => ({ collapseID: (prevState.collapseID !== collapseID ? collapseID : '') }));
}

const toggleSingleCollapse = collapseId => {
setState({
    ...state,
    [collapseId]: !state[collapseId]
  });
}

  return (
    <Router>
      <MDBContainer>
        <MDBNavbar color="amber lighten-4" style={{ marginTop: '20px' }} light>
          <MDBContainer>
            <MDBNavbarBrand>
              MDBNavbar
            </MDBNavbarBrand>
            <MDBHamburgerToggler color="#d3531a" id="hamburger1" onClick={()=> toggleSingleCollapse('collapse1')} />
              <MDBCollapse isOpen={state.collapse1} navbar>
                <MDBNavbarNav left>
                  <MDBNavItem active>
                    <MDBNavLink to="#!">Home</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to="#!">Link</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to="#!">Profile</MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </MDBContainer>
    </Router>
    );
  
}

export default NavbarPage;
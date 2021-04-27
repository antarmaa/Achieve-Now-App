import React from "react";
import styled from "styled-components";

import {
  Link,
  withRouter,
} from "react-router-dom";

const logo1 = require("../../components/logo1.png");

const StyledSideNav = styled.div`
  position: fixed; /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 103%;
  width: 100px; /* Set the width of the sidebar */
  z-index: 1; /* Stay on top of everything */
  top: 3.4em; /* Stay at the top */
  background-color: #222; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-bottom: 100px;
  margin-bottom: 200px;
  margin-top: -70px;
`;

class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: props.location.pathname,
      items: [
        {
          path:
            "/" /* path is used as id to check which NavItem is active basically */,
          name: "Home",
          css: "fas fa-home",
          title: "Home",
          key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
        },
        {
          path: "/module",
          name: "Module",
          css: "fas fa-pen",
          title: "Skills Review",
          key: 2,
        },
        {
          path: "/gradebook",
          name: "GradeBook",
          css: "fas fa-check",
          title: "Gradebook",
          key: 3,
        },
        {
          path: "/calendar",
          name: "calendar",
          css: "fas fa-calendar",
          title: "Calendar",
          key: 4,
        },
        {
          path: "/reading-page",
          name: "reading-page",
          css: "fas fa-book",
          title: "Reading Page",
          key: 5,
        },
        {
          path: "/class-page",
          name: "class_page",
          css: "fas fa-book",
          title: "Class Page",
          key: 6,
        },
  
      {
        path: "/profile-table",
        name: "ProfileTable",
        css: "fas fa-child",
        title: "Profile Table",
        key: 8,
      },
      ],
    };
  }

  onItemClick = (path) => {
    this.setState({ activePath: path });
  };

  render() {
    const { items, activePath } = this.state;
    return (
      <>
        <StyledSideNav>
          <img className="logo1" src={logo1} alt="" />

          {items.map((item) => {
            return (
              <>
                <NavItem
                  path={item.path}
                  name={item.name}
                  title={item.title}
                  css={item.css}
                  onItemClick={this.onItemClick}
                  active={item.path === activePath}
                  key={item.key}
                />
              </>
            );
          })}
        </StyledSideNav>
      </>
    );
  }
}

const RouterSideNav = withRouter(SideNav);

const StyledNavItem = styled.div`
  height: px;
  width: 100px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin-top: 20px;
  margin-bottom: px; /* Puts space between NavItems */
  a {
    font-size: 35px;
    color: ${(props) => (props.active ? "white" : "#fff")};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }
  }
`;

class NavItem extends React.Component {
  handleClick = () => {
    const { path, onItemClick } = this.props;
    onItemClick(path);
  };

  render() {
    const { active } = this.props;
    return (
      <>
        <StyledNavItem active={active}>
          <Link
            to={this.props.path}
            className={this.props.css}
            onClick={this.handleClick}
          >
            <NavIcon></NavIcon>
            <div
              style={{ fontSize: 10, fontFamily: "Helvetica", color: "white" }}
            >
              {this.props.title}
            </div>
          </Link>
        </StyledNavItem>
      </>
    );
  }
}

const NavIcon = styled.div``;

export default class StaffSidebar extends React.Component {
  render() {
    return <RouterSideNav></RouterSideNav>;
  }
}

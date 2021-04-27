import React from "react";
import { NavigationBar } from "../../components/NavigationBar";
import "../../../node_modules//bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { Home } from "../home";
import { Module } from "../module";
import ParentSideBar from "../../components/SideBar/ParentSideBar";
import { GradebookParent } from "../gradebook-parent";
import { Calendar } from "../Calendar";

const CoachMenu = () => {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <ParentSideBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/calendar" component={Calendar}/>
          <Route path="/module" component={Module} />
          <Route path="/gradebook" component={GradebookParent} />
          <Route path="/calendar" />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default CoachMenu;

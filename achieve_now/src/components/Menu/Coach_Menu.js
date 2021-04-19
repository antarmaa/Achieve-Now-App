import React from "react";
import { NavigationBar } from "../../components/NavigationBar";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { Home } from "../home";
import { Module } from "../module";
import CoachSideBar from "../../components/SideBar/CoachSideBar";
import { Gradebook } from "../gradebook";
import { Calendar } from "../Calendar";
import { LessonHistory } from "../lesson-history";

const CoachMenu = () => {
  return (
    <>
      <Router>
        <NavigationBar />
        <CoachSideBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/module" component={Module} />
          <Route path="/gradebook" component={Gradebook} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/lesson-history" component={LessonHistory} />
      
        </Switch>
      </Router>
    </>
  );
};

export default CoachMenu;

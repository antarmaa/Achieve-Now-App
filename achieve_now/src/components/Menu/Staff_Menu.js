import React from "react";
import { NavigationBar } from "../../components/NavigationBar";
import "../../../node_modules//bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { Home } from "../home";
import { Module } from "../module";
import StaffSideBar from "../SideBar/StaffSideBar";
import { Gradebook } from "../gradebook";
import { ReadingPages } from "../reading-portal";
import { ClassPage } from "../class_page";
import { LessonHistory } from "../lesson-history";
import { ProfileTable } from "../profile-table";
import { Calendar } from "../Calendar";

/*
This file contain the routes for the staff sidemenu bar 
*/
const StaffMenu = () => {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <StaffSideBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/module" component={Module} />
          <Route path="/gradebook" component={Gradebook} />
          <Route path="/calendar" component={Calendar}/>
          <Route path="/reading-page" component={ReadingPages} />
          <Route path="/class-page" component={ClassPage} />
          <Route path="/lesson-history" component={LessonHistory} />
          {/* <Route path="/register-user" component={RegisterUser} /> */}
          <Route path="/profile-table" component={ProfileTable} />

        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default StaffMenu;

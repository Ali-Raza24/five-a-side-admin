/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components\
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "../../routes/dashboard";

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "../../assets/img/sidebar-2.jpg";
import defaultSideImage from "../../assets/img/home-header.jpg";
import logo from "../../assets/img/reactlogo.png";
import defaultLogo from "../../assets/img/logo.png";
import Header from "../../components/Header/Header.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps";
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  componentDidMount() {
    console.log("aaarrr");
    // if (navigator.platform.indexOf("Win") > -1) {
    //   const ps = new PerfectScrollbar(this.refs.mainPanel);
    // }
    // window.addEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }
  render() {
    const { classes, ...rest } = this.props;

    const switchRoutes = (
      <Switch>
        {dashboardRoutes.map((prop, key) => {
          if (prop.redirect)
            return <Redirect from={prop.path} to={prop.to} key={key} />;
          return (
            <Route
              path={prop.path}
              render={(routerProps) => (
                <prop.component {...routerProps} user={this.props.user} />
              )}
              key={key}
            />
          );
        })}
      </Switch>
    );

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText={"Five A Side"}
          logo={defaultLogo}
          image={defaultSideImage}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="myBlue"
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer /> : null}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(App);

import "./assets/css/material-dashboard-react.css";
import indexRoutes from "./routes/index.jsx";
import React, { Component } from "react";
import { Router, Route, Switch, withRouter } from "react-router-dom";
import "./index.css";
import Dashboard from "./layouts/Dashboard/Dashboard";
import config from "./config";
import AuthService from "./services/AuthService";
import AdminDashboard from "./layouts/AdminDashboard/AdminDashboard";
import Login from "./views/Login/Login";
import BigSpinner from "./components/_shared/BigSpinner";

class App extends Component {
  constructor(props) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      unauthenticated: false,
      roleId: null,
      showSpinner: true,
    };
  }

  componentDidMount() {
    this.authService
      .me()
      .then((response) => {
        this.setState({
          roleId: response.data.user.role_id,
          user: response.data.user,
          showSpinner: false,
        });
      })
      .catch((err) => {
        this.setState({ showSpinner: false });
        // this.setState({ unauthenticated: true, showSpinner: false })
      });
  }

  renderRoutes = (routeProps) => {
    if (!this.state.roleId || this.state.unauthenticated) {
      return <Route path={"/login"} component={Login} />;
    } else if (this.state.roleId === 2) {
      return <Dashboard {...routeProps} user={this.state.user} />;
    } else if (this.state.roleId === 3) {
      return <AdminDashboard {...routeProps} user={this.state.user} />;
    }
  };

  render() {
    if (this.state.showSpinner) {
      return <BigSpinner />;
    }
    return (
      <Switch>
        {indexRoutes.map((prop, key) => {
          return (
            <Route
              path={prop.path}
              key={key}
              render={(routeProps) => this.renderRoutes(routeProps)}
            />
          );
        })}
      </Switch>
    );
  }
}

export default withRouter(App);

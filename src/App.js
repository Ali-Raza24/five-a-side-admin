import "./assets/css/material-dashboard-react.css";
import indexRoutes from "./routes/index.jsx";
import React, { Component, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./index.css";
import Dashboard from "./layouts/Dashboard/Dashboard";
import AuthService from "./services/AuthService";
import AdminDashboard from "./layouts/AdminDashboard/AdminDashboard";
import Login from "./views/Login/Login";
import BigSpinner from "./components/_shared/BigSpinner";

const authService = new AuthService();
function App(props) {
  const [state, setState] = useState({
    unauthenticated: false,
    roleId: null,
    user: null,
    showSpinner: true,
  });
  const history = useHistory();

  useEffect(() => {
    authService
      .me()
      .then((response) => {
        // roleId: response.data.user.role_id,
        //           user: response.data.user,
        //           showSpinner: false,
        setState({
          ...state,
          roleId: response.data.user.role_id,
          user: response.data.user,
          showSpinner: false,
          unauthenticated: false,
        });
        history.push("/dashboard");
      })
      .catch((err) => {
        setState({
          ...state,
          showSpinner: false,
          unauthenticated: true,
        });
      });
    history.push("/login");
  }, []);

  function login(user) {
    setState({
      ...state,
      user,
      roleId: user.role_id,
    });
  }

  const renderRoutes = (routeProps) => {
    if (state.roleId === 2) {
      return <Dashboard {...routeProps} user={state.user} />;
    } else if (state.roleId === 3) {
      return <AdminDashboard {...routeProps} user={state.user} />;
    }

    return (
      <Route
        path={"/login"}
        render={(props) => <Login {...props} loginUser={login} />}
      />
    );
  };

  if (state.showSpinner) {
    return <BigSpinner />;
  }

  return (
    <Switch>
      {indexRoutes.map((prop, key) => {
        return (
          <Route
            path={prop.path}
            key={key}
            render={(routeProps) => renderRoutes(routeProps)}
          />
        );
      })}
    </Switch>
  );
}

export default App;

import "./index.css";
import "./assets/css/material-dashboard-react.css";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import App from "./App";
import { Router } from "react-router-dom";

const history = createBrowserHistory();
ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,

  document.getElementById("root")
);

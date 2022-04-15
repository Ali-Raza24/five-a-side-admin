import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PayoutPage from "../../components/Payout/PayoutPage";

const Payout = (props) => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={props.match.url}
          render={(routerProps) => <PayoutPage {...routerProps} user={props.user}/>}
        />
        <Route  render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};

export default Payout;
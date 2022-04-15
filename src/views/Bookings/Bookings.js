import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import BookingPage from "../../components/Bookings/BookingPage";

const Bookings = (props) => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={props.match.url}
          render={(routerProps) => <BookingPage {...routerProps}/>}
        />
        <Route  render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};

export default Bookings;
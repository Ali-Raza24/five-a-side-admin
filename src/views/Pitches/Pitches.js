import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PitchView from "../../components/Pitches/PitchView";
import PitchPage from "../../components/Pitches/PitchPage";
import PitchCreate from "../../components/Pitches/PitchCreate";

const Pitches = (props) => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${props.match.url}/create`}
          render={(routerProps) => <PitchCreate {...routerProps}/>}
        />
        <Route
          exact
          path={`${props.match.url}/:pitchId`}
          render={(routerProps) => <PitchView {...routerProps}/>}
        />
        <Route
          exact
          path={props.match.url}
          render={(routerProps) => <PitchPage {...routerProps}/>}
        />
        <Route  render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};

export default Pitches;
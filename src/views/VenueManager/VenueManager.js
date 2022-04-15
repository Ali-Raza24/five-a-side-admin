import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import VenuePage from "../../components/VenueManager/VenuePage";
import VenueCreate from "../../components/VenueManager/VenueCreate";
import VenueView from "../../components/VenueManager/VenueView";
import PitchCreate from "../../components/Pitches/PitchCreate";


const VenueManager = (props) => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${props.match.url}/create`}
          render={(routerProps) => <VenueCreate {...routerProps} user={props.user}/>}
        />
        <Route
          exact
          path={`${props.match.url}/:venueId/edit`}
          render={(routerProps) => <VenueCreate {...routerProps} edit={true}/>}
        />
        <Route
          exact
          path={`${props.match.url}/:venueId/pitches/create`}
          render={(routerProps) => <PitchCreate {...routerProps}/>}
        />
        <Route
          exact
          path={`${props.match.url}/:venueId/pitches/:pitchId/edit`}
          render={(routerProps) => <PitchCreate edit {...routerProps}/>}
        />
        <Route
          exact
          path={`${props.match.url}/:venueId`}
          render={(routerProps) => <VenueView {...routerProps}/>}
        />
        <Route
          exact
          path={props.match.url}
          render={(routerProps) => <VenuePage {...routerProps}/>}
        />
        <Route  render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};

export default VenueManager;
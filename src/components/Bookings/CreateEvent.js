import React, { Component } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "../CustomButtons/Button.jsx";

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
    };
  }

  render() {
    return (
      <React.Fragment>
        <p className="text-left text-big mb-4">You will create new event.</p>
        <p className="text-left text-big mb-4">
          Event start:{" "}
          {this.props.selectedStartTime.toString().substring(0, 21)}
        </p>
        <p className="text-left text-big mb-4">
          Event end: {this.props.selectedEndTime.toString().substring(0, 21)}
        </p>
        <ValidatorForm
          ref="form"
          onSubmit={null}
          onError={(errors) => console.log(errors)}
        >
          <TextValidator
            className="my-input"
            style={{ width: "100%" }}
            label="Event Name"
            onChange={null}
            name="eventName"
            value={this.state.eventName}
            validators={["required"]}
            // errorMessages={['This field is required']}
          />
        </ValidatorForm>
        <Button color="primary" type="submit">
          Create
        </Button>
      </React.Fragment>
    );
  }
}

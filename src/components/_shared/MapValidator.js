import React from 'react';
import red from '@material-ui/core/colors/red';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import LocationMap from "./LocationMap";

const red300 = red['500'];

const style = {
  // right: 0,
  bottom: -30,
  fontSize: '0.75rem',
  color: red300,
  position: 'absolute',
  marginTop: '-25px',
  fontWeight: 400,
  lineHeight: '1em',
  letterSpacing: '0.03333em',
};

class MapValidator extends ValidatorComponent {

  errorText() {
    const { isValid } = this.state;

    if (isValid) {
      return null;
    }

    return (
      <div style={style}>
        <p style={{margin:0}}>Please select map location</p>
      </div>
    );
  }

  render() {
    const { errorMessages, validators, requiredError, value, ...rest } = this.props;

    return (
      <div>
        <LocationMap
          {...rest}
          ref={(r) => { this.input = r; }}
          setCoordinates={this.props.setCoordinates}
          coordinates={this.props.coordinates}
        />
        {this.errorText()}
      </div>
    );
  }
}

export default MapValidator;
import React from 'react';
import red from '@material-ui/core/colors/red';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import LocationMap from "./LocationMap";
import ImageCropper from "./ImageCropper";

const red300 = red['500'];

const style = {
  // right: 0,
  bottom: -20,
  fontSize: '0.75rem',
  color: red300,
  position: 'absolute',
  fontWeight: 400,
  lineHeight: '1em',
  letterSpacing: '0.03333em',
  paddingLeft: 15,
};

class ImageValidator extends ValidatorComponent {

  errorText() {
    const { isValid } = this.state;

    if (isValid) {
      return null;
    }

    return (
      <div style={style}>
        <p style={{margin:0}}>Please select image</p>
      </div>
    );
  }

  render() {
    const { errorMessages, validators, requiredError, value, ...rest } = this.props;

    return (
      <React.Fragment>
        <ImageCropper
          {...rest}
          ref={(r) => { this.input = r; }}
          edit={this.props.edit}
          image={this.props.image}
          setImageInParentState={this.props.setImageInParentState}
          venueId={this.props.venueId}
        />
        {this.errorText()}
      </React.Fragment>
    );
  }
}

export default ImageValidator;
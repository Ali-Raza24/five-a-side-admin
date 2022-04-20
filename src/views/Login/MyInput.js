import React, { Component } from "react";

class MyInput extends Component {
  render() {
    const {
      type,
      name,
      value,
      placeholder,
      onChange,
      errorMessage,
      withIcon,
      showPassword,
    } = this.props;
    return (
      <React.Fragment>
        <div className="form-group position-relative">
          <input
            type={type}
            name={name}
            className="form-control"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
          {/* Redner show/hide password icon*/}

          {/* Render errors */}
          {this.props.stateError && (
            <div className="register-error pt-1">
              <p className="m-0">{this.props.stateError}</p>
            </div>
          )}
          {!this.props.stateError &&
            errorMessage && (
              <div className="register-error pt-1">
                <p className="m-0">{errorMessage}</p>
              </div>
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default MyInput;

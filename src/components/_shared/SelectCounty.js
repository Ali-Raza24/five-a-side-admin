import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import GridItem from "../../components/Grid/GridItem.jsx";
import React, { Component } from "react";
import { counties } from "./Counties";
import SelectValidator from "./SelectValidator";

const styles = (theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(),
    minWidth: 120,
  },
});

class SelectCounty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      county: {
        name: "",
      },
      city: {
        name: "",
      },
    };
  }

  render() {
    const {
      classes,
      formControlProps,
      countyLabelText,
      cityLabelText,
      id,
      labelProps,
      error,
      success,
    } = this.props;
    const labelClasses = classNames({
      [" " + classes.labelRootError]: error,
      [" " + classes.labelRootSuccess]: success && !error,
    });

    const underlineClasses = classNames({
      [classes.underlineError]: error,
      // [classes.underlineSuccess]: success && !error,
      // [classes.underline]: true
    });

    return (
      <React.Fragment>
        <GridItem xs={12} sm={12} md={4}>
          <FormControl
            {...formControlProps}
            error={this.props.countyError}
            className={formControlProps.className + " " + classes.formControl}
            style={{
              margin: "27px 0 0 0 ",
              position: "relative",
              paddingBottom: "10px",
            }}
          >
            {countyLabelText !== undefined ? (
              <InputLabel
                className={classes.labelRoot + labelClasses + " select-label"}
                htmlFor={id}
                {...labelProps}
              >
                {countyLabelText}
              </InputLabel>
            ) : null}
            <SelectValidator
              className={this.props.countyError ? underlineClasses : "my-input"}
              name="county"
              label="County"
              validators={["required"]}
              errorMessages={["This field is required"]}
              value={this.props.county.name}
              onChange={this.props.handleSelectChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              {counties.map((county) => {
                return (
                  <MenuItem value={county.name} key={county.id}>
                    {county.name}
                  </MenuItem>
                );
              })}
            </SelectValidator>
            <FormHelperText id="component-error-text">
              {this.props.countyErrorText}
            </FormHelperText>
          </FormControl>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <FormControl
            {...formControlProps}
            error={this.props.cityError}
            className={formControlProps.className + " " + classes.formControl}
            style={{
              margin: "27px 0 0 0 ",
              position: "relative",
              paddingBottom: "10px",
            }}
          >
            {countyLabelText !== undefined ? (
              <InputLabel
                className={classes.labelRoot + labelClasses + " select-label"}
                htmlFor={id}
                {...labelProps}
              >
                {cityLabelText}
              </InputLabel>
            ) : null}
            <SelectValidator
              className={this.props.countyError ? underlineClasses : "my-input"}
              name="city"
              label="City"
              validators={["required"]}
              errorMessages={["This field is required"]}
              value={this.props.city.name}
              onChange={this.props.handleSelectChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              {this.props.county.name &&
                counties
                  .find((obj) => obj.name === this.props.county.name)
                  .cities.map((city) => {
                    return (
                      <MenuItem value={city.name} key={city.id}>
                        {city.name}
                      </MenuItem>
                    );
                  })}
            </SelectValidator>
            <FormHelperText id="component-error-text">
              {this.props.cityErrorText}
            </FormHelperText>
          </FormControl>
        </GridItem>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(SelectCounty);

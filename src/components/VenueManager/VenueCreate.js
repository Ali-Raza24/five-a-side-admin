import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import SelectCounty from "../_shared/SelectCounty";
import LocationMap from "../_shared/LocationMap";
import ImageCropper from "../_shared/ImageCropper";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextError from "../_shared/TextError";
import VenueService from "../../services/VenueService";
import { counties } from "../_shared/Counties";
// import Button from '@material-ui/core/Button';
import { Editor } from "@tinymce/tinymce-react";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import SelectValidator from "../_shared/SelectValidator";
import MapValidator from "../_shared/MapValidator";
import ImageValidator from "../_shared/ImageValidator";

const styles = (theme) => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  progress: {
    margin: theme.spacing(2),
  },
});

class VenueCreate extends Component {
  constructor(props) {
    super(props);
    this.venueService = new VenueService();
    this.hours = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ];
    this.state = {
      name: "",
      description: "",
      address: "",
      coordinates: null,
      city: {
        name: "",
        id: "",
      },
      county: {
        name: "",
        id: "",
      },
      image: "",
      email: "",
      phone: "",

      price: "",
      cropResult: null,
      workFrom: "",
      workTo: "",
      errors: {},
      terms: "",
    };
  }

  setParentState(county, city) {
    this.setState({ county: county, city: city });
  }

  setLocation(location) {
    this.setState({ location: location });
  }

  componentDidMount() {
    if (this.props.edit) {
      const venueId = this.props.match.params.venueId;

      this.venueService.show(venueId).then((response) => {
        const { data } = response;
        const county = data.location.county;
        const city = data.location.city;
        const workFrom = data.working_hours.split("-")[0];
        const workTo = data.working_hours.split("-")[1];
        this.setState({
          name: data.name,
          description: data.description || "",
          county: county,
          city: city,
          coordinates: JSON.parse(data.coordinates),
          address: data.address,
          image: data.image,
          email: data.contact.email,
          phone: data.contact.phone,
          workFrom: parseInt(workFrom, 10),
          workTo: parseInt(workTo, 10),
          terms: data.terms,
        });
      });
    }
  }

  handleSelectChange = (event) => {
    if (event.target.name === "county") {
      const county = counties.find((obj) => obj.name === event.target.value);
      const city = { name: "" };
      this.setState({ county: county, city: city });
    }
    if (event.target.name === "city") {
      const city = counties
        .find((county) => county.name === this.state.county.name)
        .cities.find((city) => city.name === event.target.value);
      this.setState({ city: city });
    }
  };

  setCoordinates(coordinates) {
    this.setState({ coordinates: coordinates });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  setImageInParentState = (cropResult) => {
    this.setState({ cropResult: cropResult });
  };

  deleteVenue() {
    this.venueService.delete(this.props.match.params.venueId);
  }

  handleEditorChange = (e) => {
    this.setState({
      terms: e.target.getContent(),
    });
  };

  onSubmit() {
    //  Start loading animation
    this.setState({ loading: true });

    let data = {
      user_id: this.props.id,
      city_id: this.state.city.id,
      name: this.state.name,
      description: this.state.description,
      coordinates: this.state.coordinates,
      address: this.state.address,
      phone: this.state.phone,
      price: this.state.price,
      email: this.state.email,
      terms: this.state.terms,
      working_hours: null,
    };
    if (this.state.workFrom && this.state.workTo) {
      data.working_hours = this.state.workFrom + "-" + this.state.workTo;
    }
    if (this.state.cropResult) {
      data.file = this.state.cropResult;
    }

    if (this.props.edit) {
      this.setState({ errors: {} });
      this.venueService
        .update(data, this.props.match.params.venueId)
        .then((response) => {
          this.setState({ loading: false });
          this.props.history.push("/venues");
        })
        .catch((err) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ errors: {} });
      this.venueService
        .create(data)
        .then((response) => {
          this.setState({ loading: false });
          this.props.history.push("/venues");
        })
        .catch((err) => {
          this.setState({ loading: false, errors: err.response.data.errors });
        });
    }
  }

  render() {
    console.log(this.state.terms);
    const { classes } = this.props;
    const submitButton = this.state.loading ? (
      <CircularProgress size={24} className={classes.progress} />
    ) : (
      <Button color="primary" type="submit">
        {this.props.edit ? "Update" : "Create"}
      </Button>
    );

    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.onSubmit.bind(this)}
          onError={(errors) => console.log(errors)}
        >
          <GridContainer>
            <GridItem xs={12} sm={12} md={10} style={{ margin: "0 auto" }}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Create Venue</h4>
                  <p className={classes.cardCategoryWhite}>
                    Create new venue with pitches
                  </p>
                </CardHeader>
                <CardBody style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextValidator
                        className="my-input"
                        style={{ width: "100%" }}
                        label="Name"
                        onChange={this.handleInputChange}
                        name="name"
                        value={this.state.name}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                      />
                      {this.state.errors.name && (
                        <TextError error={this.state.errors.name[0]} />
                      )}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextValidator
                        className="my-input"
                        style={{ width: "100%" }}
                        label="Phone"
                        onChange={this.handleInputChange}
                        name="phone"
                        value={this.state.phone}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextValidator
                        style={{ width: "100%" }}
                        label="Email"
                        className="my-input"
                        onChange={this.handleInputChange}
                        name="email"
                        value={this.state.email}
                        validators={["required", "isEmail"]}
                        errorMessages={[
                          "This field is required",
                          "Email is not valid",
                        ]}
                      />
                      {this.state.errors.email && (
                        <TextError error={this.state.errors.email[0]} />
                      )}
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <SelectCounty
                      county={this.state.county}
                      city={this.state.city}
                      id="contactEmail"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      cityError={this.state.errors.city_id ? true : false}
                      countyError={this.state.errors.city_id ? true : false}
                      cityErrorText={
                        this.state.errors.city_id
                          ? this.state.errors.city_id
                          : ""
                      }
                      countyErrorText={
                        this.state.errors.city_id
                          ? this.state.errors.city_id
                          : ""
                      }
                      handleSelectChange={this.handleSelectChange.bind(this)}
                    />
                    <GridItem xs={12} sm={12} md={4}>
                      <TextValidator
                        className="my-input"
                        style={{ marginTop: 27, width: "100%" }}
                        label="Address"
                        onChange={this.handleInputChange}
                        name="address"
                        value={this.state.address}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                      />
                      {this.state.errors.address && (
                        <TextError error={this.state.errors.address[0]} />
                      )}
                    </GridItem>
                  </GridContainer>
                  <InputLabel style={{ color: "#AAAAAA" }}>
                    Working hours
                  </InputLabel>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <FormControl
                        fullWidth={true}
                        error={this.state.errors.working_hours ? true : false}
                      >
                        <SelectValidator
                          className={"my-input"}
                          name="workFrom"
                          label="Work from"
                          validators={["required"]}
                          errorMessages={["This field is required"]}
                          value={this.state.workFrom}
                          onChange={this.handleInputChange}
                          SelectProps={{
                            MenuProps: {
                              className: classes.menu,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {this.hours.map((hour) => {
                            let time = hour + ":00";
                            if (hour < 10) {
                              time = "0" + time;
                            }
                            return (
                              <MenuItem value={hour} key={hour}>
                                {time}
                              </MenuItem>
                            );
                          })}
                        </SelectValidator>
                        <FormHelperText id="component-error-text">
                          {this.state.errors.working_hours
                            ? this.state.errors.working_hours
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <FormControl
                        fullWidth={true}
                        error={this.state.errors.working_hours ? true : false}
                      >
                        <SelectValidator
                          className={"my-input"}
                          name="workTo"
                          label="Work to"
                          validators={["required"]}
                          errorMessages={["This field is required"]}
                          value={this.state.workTo}
                          onChange={this.handleInputChange}
                          SelectProps={{
                            MenuProps: {
                              className: classes.menu,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {this.hours.map((hour) => {
                            let time = hour + ":00";
                            if (hour < 10) {
                              time = "0" + time;
                            }
                            return (
                              <MenuItem value={hour} key={hour}>
                                {time}
                              </MenuItem>
                            );
                          })}
                        </SelectValidator>
                        <FormHelperText id="component-error-text">
                          {this.state.errors.working_hours
                            ? this.state.errors.working_hours
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer style={{ position: "relative" }}>
                    <ImageValidator
                      validators={["required"]}
                      value={
                        !this.props.edit
                          ? this.state.cropResult
                          : this.state.image
                      }
                      edit={this.props.edit}
                      image={this.state.image}
                      setImageInParentState={this.setImageInParentState}
                      venueId={this.props.match.params.venueId}
                    />
                    {this.state.errors.file && (
                      <div style={{ paddingLeft: 15 }}>
                        <TextError error={this.state.errors.file[0]} />
                      </div>
                    )}
                  </GridContainer>
                  <GridContainer style={{ paddingTop: "40px" }}>
                    <GridItem xs={12} sm={12} md={12}>
                      <label>Terms of usage</label>
                      <Editor
                        apiKey="mcobu8wq317nonw57abmtq4cdkngauoq6s2krzvmj47766cg"
                        value={this.state.terms}
                        init={{
                          plugins: "link image code",
                          toolbar:
                            "undo redo | bold italic | alignleft aligncenter alignright | code",
                          height: "350px",
                          branding: false,
                        }}
                        onChange={(e) => this.handleEditorChange(e)}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div
                        style={{
                          height: 500,
                          position: "relative",
                          marginTop: 27,
                          marginBottom: 20,
                        }}
                      >
                        <InputLabel style={{ color: "#AAAAAA" }}>
                          Location <br />
                          <small>(Select location on map)</small>{" "}
                        </InputLabel>
                        <MapValidator
                          validators={["required"]}
                          value={this.state.coordinates}
                          setCoordinates={this.setCoordinates.bind(this)}
                          coordinates={this.state.coordinates}
                        />
                        {this.state.errors.coordinates && (
                          <div
                            style={{ position: "absolute", bottom: "-40px" }}
                          >
                            <TextError
                              error={this.state.errors.coordinates[0]}
                            />
                          </div>
                        )}
                      </div>
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <GridContainer
                    style={{ paddingLeft: "5px", paddingRight: "5px" }}
                  >
                    <GridItem md={12}>{submitButton}</GridItem>
                  </GridContainer>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </ValidatorForm>
      </div>
    );
  }
}

export default withStyles(styles)(VenueCreate);

import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import Button from "../CustomButtons/Button.jsx";
import GridContainer from "../Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem.jsx";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Swal from "sweetalert2";
import VenueService from "../../services/VenueService";
import PriceItem from "../_shared/PriceItem";
import moment from "moment";

const styles = {
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
};

class PitchCreate extends Component {
  constructor(props) {
    super(props);

    this.venueService = new VenueService();

    this.state = {
      name: "",
      prices: [],
      customPrices: [],
      venue: null,
      workingHoursArray: [],
      loading: false,
      createRequest: false,
      lastHourError: "",
    };
  }

  componentDidMount() {
    const venueId = this.props.match.params.venueId;
    const pitchId = this.props.match.params.pitchId;

    this.venueService.show(venueId).then((response) => {
      this.generateWorkingHoursArray(response.data);
      this.setState({ venue: response.data });
    });
    if (this.props.edit) {
      this.venueService.showPitch(venueId, pitchId).then((response) => {
        // Format price
        let prices = response.data.pitch_prices;
        prices.map((price) => {
          //price.price = price.price / 100;
          return price;
        });
        this.setState({
          name: response.data.name,
          prices: response.data.pitch_prices,
        });
      });
    }
  }

  generateWorkingHoursArray(venue) {
    let hours = [];
    //  Get working hours for venue
    let workFrom = venue.working_hours.split("-")[0];
    let workTo = venue.working_hours.split("-")[1];
    //  Generate working hours array
    for (let i = parseInt(workFrom, 10); i <= parseInt(workTo, 10); i++) {
      hours.push(i);
    }
    if (this.props.edit) {
      this.setState({
        workingHoursArray: hours,
      });
    } else {
      this.setState({
        workingHoursArray: hours,
        prices: [
          {
            from: hours[0],
            to: hours[hours.length - 1],
            price: "",
          },
        ],
      });
    }
  }

  addPrice(e) {
    e.preventDefault();
    let last =
      this.state.prices.length === 0
        ? "09:00"
        : this.state.prices[this.state.prices.length - 1].to;
    this.setState({
      prices: [
        ...this.state.prices,
        {
          from: last,
          to: this.state.workingHoursArray[
            this.state.workingHoursArray.length - 1
          ],
          price: "",
        },
      ],
    });
  }

  removePrice(e) {
    e.preventDefault();
    let array = this.state.prices;
    array.pop();

    this.setState({ prices: array });
  }

  handleHoursChange(e, index) {
    let arr = this.state.prices;
    arr[index].to = parseInt(e.target.value, 10);
    this.setState({ prices: arr });
  }

  setPrice(e, index) {
    let arr = this.state.prices.slice();

    arr[index].price = parseInt(e.target.value, 10) || "";

    this.setState({ prices: arr });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  deletePitch() {
    const venueId = this.props.match.params.venueId;
    const pitchId = this.props.match.params.pitchId;

    Swal.fire({
      title: "Are you sure?",
      text: "This pitch will be permanently deleted!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        this.venueService.deletePitch(venueId, pitchId).then((response) => {
          Swal.fire("Deleted!", "This pitch has been deleted.", "success");
          this.props.history.push(`/venues/${venueId}`);
        });
      }
    });
  }

  renderAddPriceLink() {
    if (this.state.prices.length > 0) {
      if (
        this.state.prices[this.state.prices.length - 1].to <
        this.state.workingHoursArray[this.state.workingHoursArray.length - 1]
      ) {
        return (
          <a
            href="#price"
            style={{ marginRight: 20, color: "#3592c8" }}
            onClick={(e) => this.addPrice(e)}
          >
            + Add new price range
          </a>
        );
      }
    }
  }

  renderRemovePriceLink() {
    if (this.state.prices.length > 1) {
      return (
        <a
          href="#remove-price"
          style={{ color: "#f44336" }}
          onClick={(e) => this.removePrice(e)}
        >
          - Remove price range
        </a>
      );
    }
  }

  renderSubmitButton() {
    let title = this.props.edit ? "Update" : "Create";
    if (!this.state.createRequest) {
      return (
        <Button color="primary" type="submit">
          {title}
        </Button>
      );
    } else {
      return <CircularProgress size={40} style={{ marginLeft: 30 }} />;
    }
  }

  renderHeader() {
    if (this.state.venue) {
      if (this.props.edit) {
        return "Edit pitch for venue " + this.state.venue.name;
      } else {
        return "Create pitch for venue " + this.state.venue.name;
      }
    }
  }

  isFormValid = () => {
    let lastHour = this.state.workingHoursArray[
      this.state.workingHoursArray.length - 1
    ];
    let lastPickedHour = this.state.prices[this.state.prices.length - 1].to;
    return lastHour === lastPickedHour;
  };

  submit = () => {
    if (!this.isFormValid()) {
      this.setState({
        lastHourError: "Please set price for all working hours",
      });
    } else {
      this.setState({ createRequest: true });
      const venueId = this.props.match.params.venueId;
      const pitchId = this.props.match.params.pitchId;
      let prices = this.state.prices;
      //  Format prices
      prices = prices.map((price) => {
        let formatPrice = { ...price };
        formatPrice.price = formatPrice.price;
        return formatPrice;
      });
      const data = {
        name: this.state.name,
        pitch_prices: prices,
      };

      if (this.props.edit) {
        this.venueService
          .updatePitch(data, venueId, pitchId)
          .then((response) => {
            this.setState({ createRequest: true });
            this.props.history.push(`/venues/${venueId}`);
          });
      } else {
        this.venueService.createPitch(venueId, data).then((response) => {
          this.setState({ createRequest: true });
          this.props.history.push(`/venues/${venueId}`);
        });
      }
    }
  };

  render() {
    console.log("state", moment.weekdays());
    const { classes, edit } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={10} style={{ margin: "0 auto" }}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  {edit ? "Edit pitch" : "Create pitch"}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  {this.renderHeader()}
                </p>
              </CardHeader>
              {this.state.loading && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <CircularProgress size={50} />
                </div>
              )}
              {!this.state.loading && (
                <div>
                  <ValidatorForm
                    ref="form"
                    onSubmit={this.submit}
                    onError={(errors) => console.log(errors)}
                  >
                    <React.Fragment>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12}>
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
                          </GridItem>
                        </GridContainer>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12}>
                            <p>Price (credits)</p>
                            {this.state.prices.map((price, index) => {
                              let last = this.state.prices.length - 1 === index;
                              return (
                                <PriceItem
                                  key={index}
                                  price={price}
                                  index={index}
                                  lastElement={last}
                                  classes={classes}
                                  handleHoursChange={this.handleHoursChange.bind(
                                    this
                                  )}
                                  workingHoursArray={
                                    this.state.workingHoursArray
                                  }
                                  setPrice={this.setPrice.bind(this)}
                                />
                              );
                            })}
                            {this.renderAddPriceLink()}
                            {this.renderRemovePriceLink()}
                            <div style={{ color: "red" }}>
                              {this.state.lastHourError}
                            </div>
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                      <CardFooter>
                        {this.renderSubmitButton()}
                        {this.props.edit && (
                          <Button
                            color="danger"
                            onClick={this.deletePitch.bind(this)}
                          >
                            Delete
                          </Button>
                        )}
                      </CardFooter>
                    </React.Fragment>
                  </ValidatorForm>
                </div>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(PitchCreate);

import React, { Fragment, Component } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import moment from "moment";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "../CustomButtons/Button";
import BookingService from "../../services/BookingService";
import TextField from "@material-ui/core/TextField";
import VenueService from "../../services/VenueService";
import Card from "../Card/Card.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardBody from "../Card/CardBody.jsx";

class ManualBooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pitch: "",
      selectedDate: null,
      from: "",
      to: "",
      description: "",
      workingHoursArray: [],
      manualBookingError: "",
      manualBookingSuccess: "",
      selectedBookingHours: [],
    };

    this.bookingService = new BookingService();
    this.venueService = new VenueService();

    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.createManualBooking = this.createManualBooking.bind(this);
    this.composeSelectedHours = this.composeSelectedHours.bind(this);
  }

  componentDidMount() {
    this.venueService.show(this.props.venue).then((res) => {
      this.composeWorkingHours(res.data.working_hours);
    });
  }

  composeWorkingHours(workTimeRange) {
    let hours = [];

    const worksFrom = workTimeRange.split("-")[0].trim();
    const worksTo = workTimeRange.split("-")[1].trim();

    for (let i = worksFrom; i <= worksTo; i++) {
      hours.push(i);
    }

    this.setState({
      workingHoursArray: hours,
    });
  }

  handleDateSelect(value) {
    this.setState(
      {
        selectedDate: value,
      },
      () => {
        this.setState({
          from: "",
          to: "",
        });
      }
    );
  }

  handleSelect(event) {
    const { name, value } = event.target;

    this.setState(
      {
        [name]: value,
      },
      () => {
        if (name === "to") {
          this.composeSelectedHours();
        }
        if (name === "from") {
          this.setState({ to: "" });
        }
      }
    );
  }

  composeSelectedHours() {
    this.setState(
      {
        selectedBookingHours: [],
      },
      () => {
        for (let i = this.state.from; i <= this.state.to - 1; i++) {
          this.state.selectedBookingHours.push({
            from: moment(this.state.selectedDate)
              .set({
                hour: i,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format("YYYY-MM-DD HH:mm:ss"),
          });
        }
      }
    );
  }

  createManualBooking() {
    this.setState({
      manualBookingError: "",
      manualBookingSuccess: "",
    });

    this.bookingService
      .bookPitch(
        this.props.pitch,
        this.state.selectedBookingHours,
        this.state.description
      )
      .then((res) => {
        this.setState({
          manualBookingSuccess: res.data.message,
        });
        this.props.fetchEvents();
      })
      .catch((err) => {
        console.log(err.response.data);
        this.setState({
          manualBookingError: Object.values(err.response.data.errors)[0][0],
        });
      });
  }

  render() {
    let formatTo = [];
    if (this.state.from) {
      let index = this.state.workingHoursArray.indexOf(this.state.from);
      formatTo = this.state.workingHoursArray.slice(
        index + 1,
        this.state.workingHoursArray.length
      );
    }
    const { classes } = this.props;

    return (
      <Fragment>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} sm={6} md={6}>
                <h4 className={classes.cardTitleWhite}>
                  Manually book this pitch
                </h4>
              </GridItem>
            </GridContainer>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={4} sm={4} md={6}>
                <InputLabel style={{ color: "#AAAAAA" }}>&nbsp;</InputLabel>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    value={this.state.selectedDate}
                    onChange={this.handleDateSelect}
                    placeholder={"Select date"}
                    minDate={moment(new Date()).add(1, "days")}
                  />
                </MuiPickersUtilsProvider>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ paddingTop: "15px" }}>
              <GridItem xs={4} sm={4} md={6}>
                <FormControl className={this.props.classes.formControl}>
                  <InputLabel style={{ color: "#AAAAAA" }}>From</InputLabel>
                  <Select
                    value={this.state.from}
                    onChange={this.handleSelect}
                    inputProps={{
                      name: "from",
                    }}
                  >
                    {this.state.workingHoursArray.map((hour, index) => {
                      if (this.state.workingHoursArray.length - 1 === index) {
                        return;
                      }
                      return (
                        <MenuItem
                          key={index}
                          value={hour}
                        >{`${hour}:00`}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={4} sm={4} md={6}>
                <FormControl className={this.props.classes.formControl}>
                  <InputLabel style={{ color: "#AAAAAA" }}>To</InputLabel>
                  <Select
                    value={this.state.to}
                    onChange={this.handleSelect}
                    inputProps={{
                      name: "to",
                      disabled: !this.state.from,
                    }}
                  >
                    {formatTo.map((hour, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={hour}
                        >{`${hour}:00`}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ paddingTop: "15px" }}>
              <GridItem md={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="description"
                  label="Description"
                  variant="outlined"
                  placeholder="Description..."
                  multiline
                  rows="4"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.description}
                  onChange={this.handleSelect}
                />
              </GridItem>
            </GridContainer>

            {this.state.manualBookingSuccess && (
              <p style={{ color: "#3592c8" }}>
                {this.state.manualBookingSuccess}
              </p>
            )}

            {this.state.manualBookingError && (
              <p style={{ color: "red" }}>{this.state.manualBookingError}</p>
            )}
            <Button color="primary" onClick={this.createManualBooking}>
              Create Booking
            </Button>
          </CardBody>
        </Card>
        {/*<GridContainer>*/}
        {/*    <GridItem md={12}>*/}
        {/*        <h3>Manually book this pitch</h3>*/}
        {/*    </GridItem>*/}
        {/*</GridContainer>*/}
      </Fragment>
    );
  }
}
export default ManualBooking;

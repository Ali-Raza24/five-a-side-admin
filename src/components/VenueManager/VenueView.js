import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import { Link } from "react-router-dom";
import VenueService from "../../services/VenueService";
import config from "../../config";
import Paper from "@material-ui/core/Paper";
import { Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Swal from "sweetalert2";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import moment from "moment";
import ManualBooking from "../_shared/ManualBooking";

const style = (theme) => ({
  root: {
    width: "100%",
    // marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },

  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative",
  },

  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px",
  },
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
});

class VenueView extends Component {
  constructor(props) {
    super(props);

    this.venueService = new VenueService();

    this.state = {
      venue: null,
      loading: true,
      manualBookingDate: new moment(),
    };
  }

  componentDidMount() {
    this.getVenue();
  }

  getVenue() {
    const venueId = this.props.match.params.venueId;
    this.venueService.show(venueId).then(
      (response) => {
        this.setState({ venue: response.data, loading: false });
      },
      () => this.forceUpdate()
    );
  }

  deleteVenue() {
    Swal.fire({
      title: "Are you sure?",
      text: "This venue will be permanently deleted!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.venueService
          .delete(this.props.match.params.venueId)
          .then((response) => {
            this.props.history.push("/venues");
          });
      }
    });
  }

  deletePitch(pitchId) {
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
        this.venueService
          .deletePitch(this.props.match.params.venueId, pitchId)
          .then((response) => {
            let venue = this.state.venue;
            venue.pitches = this.state.venue.pitches.filter(
              (pitch) => pitch.id !== pitchId
            );
            this.setState({ venue: venue });
            Swal.fire("Deleted!", "This pitch has been deleted.", "success");
          });
      }
    });
  }

  renderPitches() {
    const { classes } = this.props;

    if (this.state.venue) {
      const { pitches } = this.state.venue;

      if (pitches.length > 0) {
        return (
          <Paper className={classes.root}>
            <Grid item xs={12}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Pitch Name </TableCell>
                    <TableCell align="left">Time Period</TableCell>
                    <TableCell align="left">Price (credits)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pitches.map((pitch) =>
                    pitch.pitch_prices.map((price, index) => (
                      <TableRow key={index}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={pitch.pitch_prices.length}
                            component="th"
                            scope="row"
                          >
                            <Link
                              to={`/pitches/${pitch.id}`}
                              style={{ color: "#2e91ca" }}
                            >
                              {" "}
                              {pitch.name}
                            </Link>
                          </TableCell>
                        )}
                        <TableCell align="left">{`${price.from} - ${
                          price.to
                        }`}</TableCell>
                        <TableCell align="left">{price.price}</TableCell>

                        {index === 0 && (
                          <TableCell
                            rowSpan={pitch.pitch_prices.length}
                            align="center"
                          >
                            <Link
                              to={`${this.props.match.url}/pitches/${
                                pitch.id
                              }/edit`}
                            >
                              <IconButton
                                className={classes.button}
                                aria-label="Delete"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Link>
                            <IconButton
                              onClick={() => this.deletePitch(pitch.id)}
                              className={classes.button}
                              aria-label="Delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        );
      } else {
        return (
          <Paper className={classes.root}>
            <Grid item xs={12}>
              <h3 style={{ textAlign: "center" }}>
                This venue does not have any pitches.
              </h3>
            </Grid>
          </Paper>
        );
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { venue } = this.state;

    let venueName, city, county, address, phone, email, description;
    if (venue) {
      venueName = venue.name;
      city = venue.location.city.name;
      county = venue.location.county.name;
      address = venue.address;
      phone = venue.contact.phone;
      email = venue.contact.email;
      description = venue.description;
    }

    return (
      <React.Fragment>
        <h2>Venue</h2>
        {this.state.loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress size={50} />
          </div>
        )}
        {!this.state.loading && (
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="primary">
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                      <h4 className={classes.cardTitleWhite}>{venueName}</h4>
                      <p className={classes.cardCategoryWhite}>{city}</p>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={6}
                      md={6}
                      style={{ textAlign: "right" }}
                    >
                      <Link to={`${this.props.match.url}/pitches/create`}>
                        <Button color="white">Add pitch</Button>
                      </Link>
                    </GridItem>
                  </GridContainer>
                </CardHeader>
                <CardBody>
                  <div className={classes.typo}>
                    <div className={classes.note}>County and City</div>
                    <p>{`${county}, ${city}`}</p>
                  </div>
                  <div className={classes.typo}>
                    <div className={classes.note}>Address</div>
                    <p>{address}</p>
                  </div>
                  <div className={classes.typo}>
                    <div className={classes.note}>Phone</div>
                    <p>{phone}</p>
                  </div>
                  <div className={classes.typo}>
                    <div className={classes.note}>E-mail</div>
                    <p>{email}</p>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card profile>
                {this.state.venue && (
                  <img
                    style={{ display: "block", width: "100%" }}
                    src={`${config.IMAGE_URL}venues/${this.state.venue.id}/${
                      this.state.venue.image
                    }`}
                    alt=""
                  />
                )}
              </Card>
              <div className="action-buttons-wrap">
                <Link to={`${this.props.match.url}/edit`}>
                  <Button color="primary">Edit venue</Button>
                </Link>
                <Button onClick={this.deleteVenue.bind(this)} color="danger">
                  Delete venue
                </Button>
              </div>
            </GridItem>
          </GridContainer>
        )}
        {this.state.loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress size={50} />
          </div>
        )}
        {!this.state.loading && (
          <GridContainer>
            <GridItem xs={8} sm={8} md={8}>
              <h2 style={{ marginBottom: 10 }}>Pitches</h2>
              <Card>{this.renderPitches()}</Card>
            </GridItem>
            {/*  <GridItem xs={4} sm={4} md={4}>*/}
            {/*    <h2>Create manual booking</h2>*/}
            {/*    <ManualBooking venue={this.state.venue} getVenue={this.getVenue} />*/}
            {/*  </GridItem>*/}
          </GridContainer>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(style)(VenueView);

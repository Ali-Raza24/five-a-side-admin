import React, { Component } from "react";
import Button from "../../components/CustomButtons/Button.jsx";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VenueService from "../../services/VenueService";
import Swal from "sweetalert2";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
});

class VenuePage extends Component {
  constructor(props) {
    super(props);

    this.venueService = new VenueService();

    this.state = {
      venues: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.venueService.getVenueManagerVenues().then((response) => {
      this.setState({ venues: response.data, loading: false });
    });
  }

  renderVenues = () => {
    const { venues } = this.state;
    const { classes } = this.props;
    return venues.map((venue) => (
      <TableRow key={venue.id} hover>
        <TableCell component="th" scope="row">
          <Link to={`/venues/${venue.id}`} style={{ color: "#2e91ca" }}>
            {" "}
            {venue.name}
          </Link>
        </TableCell>
        <TableCell align="right">{venue.address}</TableCell>
        <TableCell align="right">{venue.location.city.name}</TableCell>
        <TableCell align="right">{venue.contact.email}</TableCell>
        <TableCell align="right">{venue.pitches.length}</TableCell>
        <TableCell align="right">
          <IconButton
            className={classes.button}
            aria-label="Delete "
            onClick={() => this.deleteVenue(venue.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Link to={`/venues/${venue.id}/edit`}>
            <IconButton className={classes.button} aria-label="Edit">
              <EditIcon fontSize="small" />
            </IconButton>
          </Link>
        </TableCell>
      </TableRow>
    ));
  };

  deleteVenue(venueId) {
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
        this.venueService.delete(venueId).then((response) => {
          this.setState({
            venues: this.state.venues.filter((venue) => venue.id !== venueId),
          });
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        });
      }
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1 style={{ margin: 0 }}>Venue page</h1>
        <Link to="venues/create">
          <Button color="primary">Create Venue</Button>
        </Link>
        <Paper className={classes.root}>
          <Grid item xs={12}>
            {this.state.loading && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress size={50} />
              </div>
            )}
            {this.state.venues &&
              this.state.venues.length > 0 && (
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Venue name</TableCell>
                      <TableCell align="right">Address</TableCell>
                      <TableCell align="right">City</TableCell>
                      <TableCell align="right">E-mail</TableCell>
                      <TableCell align="right">Number of pitches</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.renderVenues()}</TableBody>
                </Table>
              )}
            {this.state.venues &&
              this.state.venues.length === 0 && (
                <h3 style={{ textAlign: "center" }}>
                  You currently don't have venues.
                </h3>
              )}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(VenuePage);

import React from "react";
import Button from "../../components/CustomButtons/Button.jsx";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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

function SimpleTable(props) {
  const { classes } = props;
  const rows = [
    {
      id: 1,
      name: "Cair tennis",
      price: "10$",
      venue: "Cair",
    },
    {
      id: 2,
      name: "Bubanj tennis",
      price: "20$",
      venue: "Bubanj",
    },
    {
      id: 3,
      name: "Park tennis",
      price: "30$",
      venue: "Park",
    },
  ];

  return (
    <div>
      <h1 style={{ margin: 0 }}>Pitches page</h1>
      <Link to="/pitches/create">
        <Button color="primary">Create Pitch</Button>
      </Link>
      <Paper className={classes.root}>
        <Grid item xs={12}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Pitch name</TableCell>
                <TableCell align="right">Price (credits)</TableCell>
                <TableCell align="right">Venue</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/pitches/${row.id}`}
                      style={{ color: "#2e91ca" }}
                    >
                      {" "}
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.venue}</TableCell>
                  <TableCell align="right">
                    <IconButton className={classes.button} aria-label="Delete">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton className={classes.button} aria-label="Delete">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Paper>
    </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);

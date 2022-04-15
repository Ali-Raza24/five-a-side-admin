import React, { Component } from "react";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import VenueService from "../../services/VenueService";

const style = {
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
};

class PitchView extends Component {
  constructor(props) {
    super(props);

    this.venueService = new VenueService();

    this.state = {
      pitch: null,
    };
  }

  componentDidMount() {
    this.venueService.showPitch();
  }
  render() {
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>tests </h4>
          <p className={classes.cardCategoryWhite}>test</p>
        </CardHeader>
        <CardBody>
          <div className={classes.typo}>
            <div className={classes.note}>County and City</div>
            <p>asdasd</p>
          </div>
          <div className={classes.typo}>
            <div className={classes.note}>Address</div>
            <p>asdasd</p>
          </div>
          <div className={classes.typo}>
            <div className={classes.note}>Phone</div>
            <p>asdasd</p>
          </div>
          <div className={classes.typo}>
            <div className={classes.note}>E-mail</div>
            <p>asdasd</p>
          </div>
          <div className={classes.typo}>
            <div className={classes.note}>Description</div>
            <p>asdasd</p>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default withStyles(style)(PitchView);

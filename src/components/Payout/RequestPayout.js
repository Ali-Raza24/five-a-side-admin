import React, { Component } from "react";
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Box from "@material-ui/core/Box";
import Button from "../../components/CustomButtons/Button.jsx";
import { withStyles } from "@material-ui/core/styles";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import PayoutService from "../../services/PayoutService";

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

class RequestPayout extends Component {
  constructor(props) {
    super(props);

    this.payoutService = new PayoutService();

    this.state = {
      amount: "",
      disableRequest: false,
    };
  }

  componentDidMount() {
    this.payoutService.getUserPayoutRequests().then((res) => {
      if (res.data.data.length > 0) {
        this.setState({
          disableRequest: true,
        });
      }
    });
  }

  handleInputChange = (event) => {
    this.setState({ amount: event.target.value });
    let today = new Date();
    let date =
      today.getDate() +
      "-" +
      (parseInt(today.getMonth()) + 1) +
      "-" +
      today.getFullYear();
    this.setState({ requestDate: date });
  };

  onSubmit() {
    this.payoutService
      .createPayoutRequest(this.state.amount)
      .then((res) => this.props.table.current.onQueryChange());
  }

  render() {
    const { classes, tokens } = this.props;
    const { disableRequest } = this.state;
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
                <CardHeader
                  color="primary"
                  style={{ paddingTop: "15px", paddingBottom: "15px" }}
                >
                  <h4
                    style={{ marginBottom: 0, marginTop: 0 }}
                    className={classes.cardTitleWhite}
                  >
                    Create payout request
                  </h4>
                  <Box>(current token amount: {tokens})</Box>
                </CardHeader>
                <CardBody style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      {disableRequest && (
                        <Box style={{ color: "#f44336" }}>
                          You already have another payout request with status
                          pending.
                        </Box>
                      )}
                      {!disableRequest && (
                        <TextValidator
                          className="my-input"
                          style={{ width: "100%" }}
                          label="Enter amount"
                          onChange={this.handleInputChange}
                          name="amount"
                          value={this.state.amount}
                          validators={[
                            "required",
                            "minNumber:50",
                            `maxNumber:${tokens}`,
                          ]}
                          errorMessages={[
                            "This is required",
                            "Minimum amount should be above 50",
                            `Maximum amount of tokens should not exceed ${tokens}`,
                          ]}
                        />
                      )}
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <GridContainer
                    style={{ paddingLeft: "5px", paddingRight: "5px" }}
                  >
                    <GridItem md={12}>
                      {!disableRequest && (
                        <Button color="primary" type="submit">
                          Request
                        </Button>
                      )}
                    </GridItem>
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
export default withStyles(styles)(RequestPayout);

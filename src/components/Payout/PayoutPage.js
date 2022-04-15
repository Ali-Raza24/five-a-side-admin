import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import GridItem from "../Grid/GridItem.jsx";
import GridContainer from "../Grid/GridContainer.jsx";
import Box from "@material-ui/core/Box";
import Button from "../CustomButtons/Button.jsx";
import Card from "../Card/Card.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardBody from "../Card/CardBody.jsx";
import CardFooter from "../Card/CardFooter.jsx";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import TokenService from "../../services/TokenService";
import MaterialTable from "material-table";
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

class PayoutPage extends Component {
  constructor(props) {
    super(props);

    this.tokenService = new TokenService();
    this.payoutService = new PayoutService();

    this.state = {
      tokens: "",
      requestsHistory: [],
      requestsPayouts: [],
      amount: "",
      disableRequest: false,
    };

    this.tableRef = React.createRef();
    this.tableHistory = React.createRef();
  }

  componentDidMount() {
    // this.tokenService.getUserTokens(this.props.user.id)
    //     .then(res => {
    //         this.setState({
    //             tokens: res.data
    //         })
    //     });

    this.payoutService.getUserPayoutRequests().then((res) => {
      if (res.data.data.length > 0) {
        this.setState({
          disableRequest: true,
        });
      }
    });
  }

  addRequest = (request) => {
    this.setState({ payouts: [...this.state.payouts, request] });
  };

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
    this.payoutService.createPayoutRequest(this.state.amount).then((res) => {
      this.tableRef.current.onQueryChange();
      this.tableHistory.current.onQueryChange();
      this.setState({
        disableRequest: true,
      });
    });
  }

  render() {
    const { classes, user } = this.props;
    const { tokens, disableRequest } = this.state;
    return (
      <div>
        <div>
          <GridContainer>
            {this.state.loading && (
              <Grid xs={12} style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress size={50} />
              </Grid>
            )}
            <Grid item xs={8} style={{ padding: 10 }}>
              {/*<ManagerPendingPayouts*/}
              {/*    user={user}*/}
              {/*    classes={classes}*/}
              {/*/>*/}

              <MaterialTable
                tableRef={this.tableRef}
                className={classes.table}
                style={{ backgroundColor: "white" }}
                title="Pending payout requests"
                columns={[
                  { title: "#", field: "id" },
                  { title: "Amount", field: "amount" },
                  {
                    title: "Request Date",
                    field: "created_at",
                    type: "datetime",
                  },
                  { title: "Status", field: "status" },
                ]}
                data={(query) =>
                  this.payoutService
                    .getUserPayoutRequests(query.pageSize, query.page + 1)
                    .then((res) => {
                      this.setState({
                        requestsPayouts: res.data.data,
                      });
                      return {
                        data: res.data.data,
                        page: res.data.meta.current_page - 1,
                        totalCount: res.data.meta.total,
                      };
                    })
                }
                options={{
                  actionsColumnIndex: -1,
                  filtering: false,
                  debounceInterval: 500,
                  search: false,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              {/*<RequestPayout table={this.tableRef} addRequest={this.addRequest} user={user} tokens={tokens}/>*/}

              <ValidatorForm
                ref="form"
                onSubmit={this.onSubmit.bind(this)}
                onError={(errors) => console.log(errors)}
              >
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={10}
                    style={{ margin: "0 auto" }}
                  >
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
                      <CardBody
                        style={{ paddingTop: "40px", paddingBottom: "40px" }}
                      >
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12}>
                            {disableRequest && (
                              <Box style={{ color: "#f44336" }}>
                                You already have another payout request with
                                status pending.
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
            </Grid>
            <Grid item xs={8} style={{ padding: 10 }}>
              {/*<ManagerPayoutHistory*/}
              {/*    user={user}*/}
              {/*    classes={classes}*/}
              {/*/>*/}
              <MaterialTable
                tableRef={this.tableHistory}
                className={classes.table}
                style={{ backgroundColor: "white" }}
                title="Payout requests history"
                columns={[
                  { title: "#", field: "id" },
                  { title: "Amount", field: "amount" },
                  {
                    title: "Request Date",
                    field: "created_at",
                    type: "datetime",
                  },
                  { title: "Status", field: "status" },
                ]}
                data={(query) =>
                  this.payoutService
                    .getUserRequestHistory(query.pageSize, query.page + 1)
                    .then((res) => {
                      this.setState({
                        requestsHistory: res.data.data,
                      });
                      return {
                        data: res.data.data,
                        page: res.data.meta.current_page - 1,
                        totalCount: res.data.meta.total,
                      };
                    })
                }
                options={{
                  actionsColumnIndex: -1,
                  filtering: false,
                  debounceInterval: 500,
                  search: false,
                }}
              />
            </Grid>
          </GridContainer>
          <GridContainer />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PayoutPage);

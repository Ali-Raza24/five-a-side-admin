import React, {Component, Fragment} from 'react';
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import InputLabel from "@material-ui/core/InputLabel";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "../CustomButtons/Button";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


import BookingService from "../../services/BookingService";
import VenueService from "../../services/VenueService";


class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pitch: '',
      id: this.props.event.id,
      selectedDate: this.props.event.start,
      from: moment(this.props.event.start).hours(),
      to: moment(this.props.event.start).add(1, 'hours').hours(),
      description: this.props.event.extendedProps.note,
      workingHoursArray: this.props.workingHours,
      manualBookingError: '',
      manualBookingSuccess: '',
      selectedBookingHours: [],
      deleteDialog: false,
      deleteBlockBookingDialog: false,
      deletionMessage: ''
    };

    this.composeSelectedHours = this.composeSelectedHours.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.updateBooking = this.updateBooking.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
    this.updateBlockBooking = this.updateBlockBooking.bind(this);
    this.toggleDeleteBlockBookingDialog = this.toggleDeleteBlockBookingDialog.bind(this);

    this.bookingService = new BookingService();
    this.venueService = new VenueService();

  }

  componentDidMount() {
    this.composeSelectedHours();
  }

  handleDateSelect(value) {
    this.setState({
      selectedDate: value
    });
  }

  composeSelectedHours() {
    this.setState({
      selectedBookingHours: [
        {
          'from': moment(this.state.selectedDate).set({
            hour: this.state.from,
            minute: 0,
            second: 0,
            millisecond: 0
          }).format('YYYY-MM-DD HH:mm:ss')
        }
      ]
    });
  }

  handleDropdownSelect(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    }, () => {
      if (name === 'to') {
        this.composeSelectedHours();
      }
      if (name === 'from') {
        this.setState({to: this.state.from + 1}, () => this.composeSelectedHours());
      }
    })
  }

  handleSelect(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    }, () => {
      if (name === 'to') {
        this.composeSelectedHours();
      }
      if (name === 'from') {
        this.setState({to: this.state.from + 1})
      }
    })
  }


  updateBooking() {
    this.setState({
      manualBookingError: '',
      manualBookingSuccess: ''
    });

    this.bookingService.updateBooking(this.state.id, this.props.pitch, this.state.selectedBookingHours, this.state.description)
      .then(res => {
        this.setState({
          manualBookingSuccess: res.data.message
        }, () => {
          setTimeout(() => {
            this.props.toggleModal();
          }, 2000)
        });
      })
      .catch(err => {
        this.setState({
          manualBookingError: Object.values(err.response.data.errors)[0][0]
        })
      })
  }

  deleteBooking() {
    this.bookingService.deleteBooking(this.state.id, this.props.pitch)
      .then(res => this.setState({
        deletionMessage: res.data.message
      }, () => {
        setTimeout(() => {
          this.toggleDialog();
          this.props.toggleModal();
        }, 2000)
      }))
  }

  deleteBlockBooking() {
    let bookingId = this.props.event.extendedProps.block_event_id;
    this.bookingService.deleteBlockBooking(bookingId)
      .then(res => {
        this.setState({
          manualBookingSuccess: res.data.message
        }, () => {
          setTimeout(() => {
            this.props.toggleModal();
          }, 2000)
        });
      })
  }

  updateBlockBooking() {
    let bookingId = this.props.event.extendedProps.block_event_id;
    let data = {};
    data.description = this.state.description;
    this.bookingService.editBlockBooking(bookingId, data)
      .then(res => {
        this.setState({
          manualBookingSuccess: res.data.message
        }, () => {
          setTimeout(() => {
            this.props.toggleModal();
          }, 2000)
        });
      })
  }

  toggleDialog() {
    this.setState(prevState => ({
      deleteDialog: !prevState.deleteDialog
    }))
  }

  toggleDeleteBlockBookingDialog() {
    this.setState(prevState => ({
      deleteBlockBookingDialog: !prevState.deleteBlockBookingDialog
    }))
  }


  renderDeleteDialog() {
    return (
      <Dialog onClose={this.toggleDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              open={this.state.deleteDialog}>
        <DialogTitle id="alert-dialog-title">{"Cancel scheduled booking?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this booking? After confirmation, this slot will be available for new
            booking.
          </DialogContentText>
          {this.state.deletionMessage &&
          <DialogContentText color='primary'>
            {this.state.deletionMessage}
          </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.toggleDialog}>
            No
          </Button>
          {/*<Button onClick={this.deleteBooking} color="primary" autoFocus>*/}
          {/*  Delete*/}
          {/*</Button>*/}
          <Button onClick={() => this.props.cancelBooking(this.state.id)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderDeleteBlockBookingDialog() {
    return (
      <Dialog onClose={this.toggleDeleteBlockBookingDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              open={this.state.deleteBlockBookingDialog}>
        <DialogTitle id="alert-dialog-title">{"Cancel scheduled booking?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this block booking? After confirmation, this slot will be available for new
            booking.
          </DialogContentText>
          {this.state.deletionMessage &&
          <DialogContentText color='primary'>
            {this.state.deletionMessage}
          </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.toggleDeleteBlockBookingDialog}>
            No
          </Button>
          {/*<Button onClick={this.deleteBooking} color="primary" autoFocus>*/}
          {/*  Delete*/}
          {/*</Button>*/}
          <Button onClick={() => this.deleteBlockBooking()} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <Fragment>
        <Card>
          <CardHeader color="primary">
            <h4 className={this.props.classes.cardTitleWhite}>Manage Booking</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={4} sm={4} md={6}>
                <div>
                  <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>User:</InputLabel>
                  <p style={{display: "inline-block", paddingLeft: 30}}>{this.props.event.title}</p>
                </div>
                {this.props.event.extendedProps.user &&
                <div>
                  <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>Email:</InputLabel>
                  <p style={{display: "inline-block", paddingLeft: 30}}>{this.props.event.extendedProps.user.email}</p>
                </div>
                }
                <div>
                  <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>Phone:</InputLabel>
                  <p style={{display: "inline-block", paddingLeft: 30}}>Not available</p>
                </div>
              </GridItem>
              <GridItem xs={4} sm={4} md={6}>
                {this.props.eventType === 'clicked' &&
                <div>
                  <div>
                    <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>Date:</InputLabel>
                    <p style={{
                      display: "inline-block",
                      paddingLeft: 30
                    }}>{moment(this.state.selectedDate).format("MMMM Do")}</p>
                  </div>
                  <div>
                    <GridContainer style={{paddingTop: '15px'}}>
                      <GridItem xs={4} sm={4} md={6}>
                        <div>
                          <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>From:</InputLabel>
                          <p style={{display: "inline-block", paddingLeft: 30}}>{this.state.from}:00</p>
                        </div>
                      </GridItem>
                      <GridItem xs={4} sm={4} md={6}>
                        <div>
                          <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>To:</InputLabel>
                          <p style={{display: "inline-block", paddingLeft: 30}}>{this.state.to}:00</p>
                        </div>
                      </GridItem>
                      {!this.props.event.extendedProps.block_event &&
                        <p style={{paddingLeft: 15}}>To change time please drag this event to specific time slot.</p>
                      }
                    </GridContainer>
                  </div>
                </div>
                }
                {this.props.eventType === 'dragged' &&
                <div>
                  <div>
                    <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>Change from:</InputLabel>
                    <p style={{display: "inline-block", paddingLeft: 30}}>
                      {moment(this.state.selectedDate).format("MMMM Do")} {this.state.from}:00 - {this.state.to}:00
                    </p>
                  </div>
                  <div>
                    <InputLabel style={{color: "#AAAAAA", display: "inline-block"}}>Change to:</InputLabel>
                    <p style={{display: "inline-block", paddingLeft: 30}}>
                      {moment(this.props.oldEvent.start).format("MMMM Do")} {moment(this.props.oldEvent.start).hours()}:00
                      - {moment(this.props.oldEvent.start).add(1, 'hours').hours()}:00
                    </p>
                  </div>
                  <div>
                    <p>You are about to change date and time for this booking. Are you sure you want to proceed?</p>
                  </div>
                </div>
                }

              </GridItem>
            </GridContainer>


            {/*{!this.props.event.extendedProps.block_event &&*/}
            <GridContainer style={{paddingTop: '15px'}}>
              <GridItem md={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name='description'
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
                  disabled={!this.props.eventEditable}
                >
                </TextField>
              </GridItem>
            </GridContainer>
            {/*}*/}

            {this.state.manualBookingSuccess &&
            <p style={{color: '#3592c8'}}>{this.state.manualBookingSuccess}</p>
            }

            {this.state.manualBookingError &&
            <p style={{color: 'red'}}>{this.state.manualBookingError}</p>
            }

            <div>


              {!this.props.event.extendedProps.block_event && this.props.eventEditable &&
                <React.Fragment>
                  <Button color="primary"
                          onClick={this.updateBooking}
                  >
                    Update booking
                  </Button>
                  <Button
                    color="danger"
                    onClick={this.toggleDialog}
                  >
                    Cancel booking
                  </Button>
                </React.Fragment>
              }
              {this.props.event.extendedProps.block_event && this.props.eventEditable &&
                <React.Fragment>
                  <Button color="primary"
                          onClick={this.updateBlockBooking}
                  >
                    Update description
                  </Button>
                <Button
                  onClick={this.toggleDeleteBlockBookingDialog}
                  color="danger"
                  style={{float: 'right'}}
                  >
                  Delete booking
                  </Button>
                </React.Fragment>
              }
              <Button onClick={this.props.toggleModal}
                      style={{float: 'right'}}
              >
                Close
              </Button>
            </div>

          </CardBody>
        </Card>
        {this.state.deleteDialog &&
        this.renderDeleteDialog()
        }
        {this.state.deleteBlockBookingDialog &&
        this.renderDeleteBlockBookingDialog()
        }
      </Fragment>

    );
  }


}

export default EditEvent;

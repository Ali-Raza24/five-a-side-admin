import React, {Component} from 'react';

import CardBody from "../Card/CardBody";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import InputLabel from "@material-ui/core/InputLabel";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "../CustomButtons/Button";
import BookingService from "../../services/BookingService";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class CreateManualEvent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: this.props.event.start,
      selectedEndDate: moment(this.props.event.start).add(7, 'days'),
      from: moment(this.props.event.start).hours(),
      to: moment(this.props.event.start).add(1, 'hours').hours(),
      pitch: this.props.pitch,
      description: '',
      manualBookingSuccess: '',
      manualBookingError: '',
      blockBooking: false
    };

    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEndDateSelect = this.handleEndDateSelect.bind(this);
    this.createBooking = this.createBooking.bind(this);

    this.bookingService = new BookingService();
  }

  handleDateSelect(value) {
    this.setState({
      selectedDate: value
    });
  }

  handleEndDateSelect(value) {
    this.setState({
      selectedEndDate: value
    });
  }

  handleSelect(e) {
    console.log('from', moment(this.props.event.start).format('HH:mm'));
    console.log('from', moment(this.props.event.start).add(1, 'hours').format('HH:mm'));
    console.log(e.target.type);
    const {value, name, checked } = e.target;

    if (e.target.type === 'checkbox') {
      this.setState({
        [name]: checked
      })
    } else {
      this.setState({
        [name]: value
      })
    }

  }

  createBooking() {
    this.setState({
      manualBookingError: '',
      manualBookingSuccess: ''
    });

    if (this.state.blockBooking) {
      let data = {
        pitch_id: this.props.pitch,
        day_of_week: moment(this.props.event.start).isoWeekday(),
        time_from: moment(this.props.event.start).format('HH:mm'),
        time_to: moment(this.props.event.start).add(1, 'hours').format('HH:mm'),
        end_date: moment(this.state.selectedEndDate).format('YYYY-MM-DD'),
        game_type: null,
        description: this.state.description
      };

      this.bookingService.blockBooking(data)
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

    } else {
      const booking = [
        {
          'from': moment(this.state.selectedDate).format('YYYY-MM-DD HH:mm:ss')
        }
      ];

      this.bookingService.bookPitch(this.state.pitch, booking, this.state.description)
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

  }


  render() {

    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={this.props.classes.cardTitleWhite}>Create booking</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={4} sm={4} md={4}>
              <InputLabel style={{color: "#AAAAAA"}}>&nbsp;</InputLabel>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  variant="inline"
                  value={this.state.selectedDate}
                  onChange={this.handleDateSelect}
                  placeholder={"Select date"}
                  minDate={moment()}
                  disabled={true}
                />
              </MuiPickersUtilsProvider>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.blockBooking}
                    onChange={this.handleSelect}
                    value="blockBooking"
                    name="blockBooking"
                    color="primary"
                  />
                }
                label="Create Block Booking"
              />
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
              {this.state.blockBooking &&
                <React.Fragment>
                  <InputLabel style={{color: "#AAAAAA"}}>Select End date</InputLabel>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant="inline"
                      value={this.state.selectedEndDate}
                      onChange={this.handleEndDateSelect}
                      placeholder={"Select date"}
                      // minDate={moment(new Date()).add(1, 'days')}
                      minDate={moment(this.props.event.start).add(7, 'days')}
                    />
                  </MuiPickersUtilsProvider>
                </React.Fragment>
              }
            </GridItem>
          </GridContainer>
          <GridContainer style={{paddingTop: '15px'}}>
            <GridItem xs={4} sm={4} md={6}>
              <FormControl className={this.props.classes.formControl}>
                <InputLabel style={{color: "#AAAAAA"}}>From</InputLabel>
                <Select
                  value={this.state.from}
                  inputProps={{
                    name: 'from',
                  }}
                  disabled={true}
                >
                  <MenuItem value={this.state.from}>{`${this.state.from}:00`}</MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={4} sm={4} md={6}>
              <FormControl className={this.props.classes.formControl}>
                <InputLabel style={{color: "#AAAAAA"}}>To</InputLabel>
                <Select
                  value={this.state.to}
                  // onChange={this.handleDropdownSelect}
                  inputProps={{
                    name: 'to',
                  }}
                  disabled={true}
                >
                  <MenuItem value={this.state.to}>{`${this.state.to}:00`}</MenuItem>
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
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
              >
              </TextField>
            </GridItem>
          </GridContainer>

          {this.state.manualBookingSuccess &&
          <p style={{color: '#3592c8'}}>{this.state.manualBookingSuccess}</p>
          }

          {this.state.manualBookingError &&
          <p style={{color: 'red'}}>{this.state.manualBookingError}</p>
          }

          <div>
            <Button color="primary"
                    onClick={this.createBooking}
            >
              Create booking
            </Button>
            <Button onClick={this.props.toggleModal}
                    style={{float: 'right'}}
            >
              Cancel
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default CreateManualEvent;
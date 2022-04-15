import React, { Fragment, SVGAttributes as info } from "react";
import "@fullcalendar/core/main.css";
import "@fullcalendar/timegrid/main.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Grid } from "@material-ui/core";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import BookingService from "../../services/BookingService";
import VenueService from "../../services/VenueService";
import moment from "moment";
import Modal from "@material-ui/core/Modal";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import EditEvent from "../../components/Bookings/EditEvent";
import CreateManualEvent from "../../components/Bookings/CreateManualEvent";

const style = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  typo: {
    paddingLeft: "35%",
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
    lineHeight: "7px",
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
  formControl: {
    // margin: theme.spacing(1),
    minWidth: "95%",
  },
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.calendarComponentRef = React.createRef();
    this.fullCalendarProps = {};

    this.state = {
      venues: [],
      pitches: [],
      events: [],
      selectedEvent: null,
      creatableEvent: null,
      trigger: null,
      selectedVenue: "",
      selectedPitch: "",
      editModal: false,
      createModal: false,
      editableEvent: "",
      editableEventType: "",
      venue: "",
      workingHoursArray: [],
    };

    this.bookingService = new BookingService();
    this.venueService = new VenueService();

    this.fetchEvents = this.fetchEvents.bind(this);
    this.initFullCalendar = this.initFullCalendar.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleEditEvent = this.handleEditEvent.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);

    this.handleSelect = this.handleSelect.bind(this);
    this.getBusinessHours = this.getBusinessHours.bind(this);
    // this.createManualBooking = this.createManualBooking.bind(this);
    // this.composeSelectedHours = this.composeSelectedHours.bind(this);

    this.initFullCalendar();
  }

  componentDidMount() {
    this.venueService.getCalendarVenues().then((res) => {
      this.setState({
        venues: res.data,
      });
    });
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

  fetchEvents(info, successCallback, failureCallback) {
    if (this.state.selectedPitch && this.state.selectedPitch != "") {
      this.venueService
        .getPitchBookings(this.state.selectedPitch, {
          start: moment(info.start.valueOf()).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(info.end.valueOf()).format("YYYY-MM-DD HH:mm:ss"),
        })
        .then((res) => successCallback(this.handleSuccess(res)));
    }
  }

  handleSuccess(res) {
    let eventArray = [];

    res.data.bookings.slice().map((event) => {
      eventArray.push({
        id: event.id,
        title:
          event.user.name === this.props.user.name
            ? `${event.description || "Desc. not set"}`
            : `${event.user.name}`,
        start: event.starts_at,
        user: event.user,
        color: event.status === 1 ? "#00e7ff" : null,
        className: "consultant-event",
        bookedBy: event.user,
        note: event.description || "-",
        block_event: false,
      });
    });

    res.data.block_bookings.map((event) => {
      let date = moment(event.time_from, "hh:mm:ss").isoWeekday(
        event.day_of_week
      );

      let endDate = moment(event.end_date).add(1, "day");
      let repeatTimes = moment.duration(endDate.diff(date)).as("weeks");

      for (let i = 0; i < repeatTimes; i++) {
        eventArray.push({
          id: event.id + "-" + i,
          title: event.description ? event.description : "Desc. not set",
          user: event.user,
          start: date
            .clone()
            .add(i, "week")
            .toDate(),
          color: "#EE4466",
          className: "consultant-event",
          bookedBy: event.user,
          note: event.description || "",
          block_event: true,
          block_event_id: event.id,
          editable: false,
        });
      }
    });
    return eventArray;
  }

  handleEventClick(object) {
    this.setState({
      selectedEvent: object.event,
    });
  }

  handleVenueChange(e) {
    const { value } = e.target;

    this.setState(
      {
        selectedVenue: value,
        selectedPitch: "",
      },
      () => {
        this.venueService.show(this.state.selectedVenue).then((res) => {
          this.setState(
            {
              venue: res.data,
            },
            async () => {
              await this.composeWorkingHours(res.data.working_hours);
            }
          );
        });
        let pitches = this.state.venues.filter(
          (venue) => venue.id == this.state.selectedVenue
        )[0]["pitches"];
        this.setState({ pitches });
      }
    );
  }

  handlePitchChange(e) {
    const { value } = e.target;
    this.setState(
      {
        selectedPitch: value,
      },
      () =>
        this.calendarComponentRef.current.calendar
          .getEventSources()[0]
          .refetch()
    );
  }

  handleEditEvent(eventClickInfo, type) {
    if (
      moment().diff(eventClickInfo.event.start) <= 0 &&
      moment(eventClickInfo.event.start) >=
        moment(eventClickInfo.event.start).set({
          hours: this.state.workingHoursArray[0],
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
    ) {
      this.setState(
        {
          editableEvent: eventClickInfo.event,
          editableEventType: type,
          oldEvent: eventClickInfo.oldEvent,
          editableEventEditable: true,
        },
        () => this.toggleEditModal()
      );
    } else {
      if (type === "clicked") {
        this.setState(
          {
            editableEvent: eventClickInfo.event,
            editableEventType: type,
            oldEvent: eventClickInfo.oldEvent,
            editableEventEditable: false,
          },
          () => this.toggleEditModal()
        );
      } else {
        this.calendarComponentRef.current.calendar
          .getEventSources()[0]
          .refetch();
      }

      // this.setState({
      //   editableEvent: eventClickInfo.event,
      //   editableEventType: type,
      //   oldEvent: eventClickInfo.oldEvent,
      //   editableEventEditable: false
      // }, () => this.toggleEditModal());

      //  Why is this here????
    }
  }

  handleCreateManualEvent(eventClickInfo) {
    if (
      moment().diff(eventClickInfo.start) <= 0 &&
      moment(eventClickInfo.start) >=
        moment(eventClickInfo.start).set({
          hours: this.state.workingHoursArray[0],
        }) &&
      this.state.selectedPitch
    ) {
      this.setState(
        {
          creatableEvent: eventClickInfo,
        },
        () => this.toggleCreateModal()
      );
    }
  }

  toggleEditModal() {
    this.setState(
      (prevState) => ({
        editModal: !prevState.editModal,
      }),
      () => {
        if (!this.state.editModal) {
          this.calendarComponentRef.current.calendar
            .getEventSources()[0]
            .refetch();
        }
      }
    );
  }

  toggleCreateModal() {
    this.setState(
      (prevState) => ({
        createModal: !prevState.createModal,
      }),
      () => {
        this.calendarComponentRef.current.calendar
          .getEventSources()[0]
          .refetch();
      }
    );
  }

  getBusinessHours() {
    if (this.state.venue) {
      this.calendarComponentRef.current.calendar.setOption("businessHours", {
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        startTime: `${this.state.workingHoursArray[0]}:00`,
        endTime: `${
          this.state.workingHoursArray[this.state.workingHoursArray.length - 1]
        }:00`,
      });
    }
  }

  initFullCalendar() {
    this.fullCalendarProps = {
      defaultView: "timeGridWeek",
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

      header: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      ref: this.calendarComponentRef,
      weekends: true,
      // minTime: "07:00:00",
      events: this.fetchEvents,
      navLinks: true,
      selectable: true,
      editable: true,
      droppable: true,
      slotDuration: "01:00:00",
      allDaySlot: false,
      eventOverlap: false,
      eventDurationEditable: false,

      selectAllow: (selectInfo) => moment().diff(selectInfo.start) <= 0,
      select: (eventClickInfo) => this.handleCreateManualEvent(eventClickInfo), // Open edit modal
      eventClick: (eventClickInfo) =>
        this.handleEditEvent(eventClickInfo, "clicked"), // Create manual booking modal
      eventDrop: (eventClickInfo) =>
        this.handleEditEvent(eventClickInfo, "dragged"), // Open modal confirm window
      // eventDragStop: (eventClickInfo) => this.onDragStop(eventClickInfo)
    };
  }

  getModalStyle() {
    const top = 25;
    return {
      top: `${top}%`,
      width: "50%",
      margin: "auto",
    };
  }

  async composeWorkingHours(workTimeRange) {
    const hours = await this.setWorkingHours(workTimeRange);

    this.setState(
      {
        workingHoursArray: hours,
      },
      () => {
        this.getBusinessHours();
      }
    );
  }

  setWorkingHours(workTimeRange) {
    let hours = [];

    const worksFrom = workTimeRange.split("-")[0].trim();
    const worksTo = workTimeRange.split("-")[1].trim();

    for (let i = worksFrom; i <= worksTo; i++) {
      hours.push(+i);
    }

    return hours;
  }

  cancelBooking(bookingId) {
    this.bookingService.cancelBooking(bookingId).then((res) => {
      this.toggleEditModal();
    });
  }

  render() {
    const { classes } = this.props;
    const { selectedEvent } = this.state;
    const modalStyle = this.getModalStyle();

    return (
      <Fragment>
        <div style={{ padding: 25, backgroundColor: "white" }}>
          <GridContainer>
            <Grid item xs={12}>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>Bookings</h2>
              {!this.state.selectedPitch ? (
                <span style={{ paddingLeft: 5 }}>
                  Please select {!this.state.selectedVenue ? "venue and" : ""}{" "}
                  pitch
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </Grid>
          </GridContainer>
          <GridContainer style={{ paddingTop: "15px" }}>
            <Grid item xs={6} md={3}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="venue">Select venue</InputLabel>
                <Select
                  value={this.state.selectedVenue}
                  onChange={this.handleVenueChange.bind(this)}
                  inputProps={{
                    name: "venue",
                    id: "venue",
                  }}
                >
                  {this.state.venues.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </MenuItem>
                  ))}
                  ;
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="pitch">Select pitch</InputLabel>
                <Select
                  value={this.state.selectedPitch}
                  onChange={this.handlePitchChange.bind(this)}
                  inputProps={{
                    name: "pitch",
                    id: "pitch",
                  }}
                >
                  {this.state.pitches.map((pitch) => (
                    <MenuItem key={pitch.id} value={pitch.id}>
                      {pitch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </GridContainer>
          <GridContainer style={{ paddingTop: 30, paddingBottom: 20 }}>
            <Grid item xs={12}>
              <FullCalendar {...this.fullCalendarProps} />
              <p className="">
                Info: To create new booking, simply click on desired field in
                calendar
              </p>
            </Grid>
          </GridContainer>
        </div>
        {this.state.selectedPitch &&
          this.state.editModal &&
          this.renderEditModal(modalStyle)}

        {this.state.selectedPitch &&
          this.state.createModal &&
          this.renderCreateModal(modalStyle)}
      </Fragment>
    );
  }

  renderEditModal(modalStyle) {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.editModal}
        onClose={this.toggleEditModal}
        style={modalStyle}
      >
        <EditEvent
          cancelBooking={this.cancelBooking}
          classes={this.props.classes}
          event={this.state.editableEvent}
          eventType={this.state.editableEventType}
          oldEvent={this.state.oldEvent}
          eventEditable={this.state.editableEventEditable}
          workingHours={this.state.workingHoursArray}
          toggleModal={this.toggleEditModal}
          pitch={this.state.selectedPitch}
        />
      </Modal>
    );
  }

  renderCreateModal(modalStyle) {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.createModal}
        onClose={this.toggleCreateModal}
        style={modalStyle}
      >
        <CreateManualEvent
          classes={this.props.classes}
          workingHours={this.state.workingHoursArray}
          event={this.state.creatableEvent}
          pitch={this.state.selectedPitch}
          toggleModal={this.toggleCreateModal}
        />
      </Modal>
    );
  }
}

export default withStyles(style)(Dashboard);

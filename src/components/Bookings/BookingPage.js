import "@fullcalendar/core/main.css";
import "@fullcalendar/timegrid/main.css";

import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import React, { Component } from "react";
import Swal from "sweetalert2";
import SelectCalendarDialog from "./SelectCalendarDialog";
import CreateEvent from "./CreateEvent";
import EventClickDialog from "./EventClickDialog";
import EditEvent from "./EditEvent";
import ViewEvent from "./ViewEvent";
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
});

class BookingPage extends Component {
  constructor(props) {
    super(props);
    this.calendarComponentRef = React.createRef();
    this.state = {
      calendarWeekends: true,
      calendarEvents: [
        // initial event data
        { title: "Event Now", start: new Date() },
      ],
      resources: [
        { id: "a", title: "Pitch A" },
        { id: "b", title: "Pitch B" },
        { id: "c", title: "Pitch C" },
        { id: "d", title: "Pitch D" },
      ],
      showDialog: false,
      selectedStartTime: null,
      selectedEndTime: null,
      selectedPitchId: "",
      isCreateFormVisible: false,
      showEventClickDialog: false,
      isEditFormVisible: false,
      isViewFormVisible: false,
    };
  }

  getEvents = () => {
    return [
      {
        id: 1,
        resourceId: "b",
        title: "Event 1",
        start: "2019-06-20T16:00:00",
        className: "meeting-event",
      },
      {
        id: 2,
        resourceId: "c",
        title: "Event 2",
        start: "2019-06-20T16:00:00",
        end: "2019-06-20T19:00:00",
        className: "consultant-event",
      },
      {
        id: 2,
        resourceId: "c",
        title: "Event 2",
        start: "2019-06-20T16:00:00",
        end: "2019-06-20T19:00:00",
        className: "consultant-event",
      },
      {
        id: 3,
        resourceId: "d",
        title: "Event 3",
        start: "2019-06-20T16:00:00",
        className: "consultant-event",
      },
    ];
  };

  modalToggle = () => {
    this.setState({
      showDialog: !this.state.showDialog,
      isCreateFormVisible: false,
    });
  };

  handleMultipleSelect = (e) => {
    // this.modalToggle();
    this.setState({
      showDialog: true,
      selectedStartTime: e.start,
      selectedEndTime: e.end,
      selectedPitchId: e.resource.id,
    });
  };

  handleEventClick = (e) => {
    console.log("event", e);
    this.eventClickDialogToggle();
  };

  disableSelectedTime = () => {
    this.modalToggle();
    Swal.fire({
      title: "Are you sure?",
      text: "This selected time will be disabled!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        //make api call
        console.log("Make api call for create event");
      }
    });
  };

  showCreateForm = () => {
    this.setState({
      showDialog: false,
      isCreateFormVisible: true,
      isEditFormVisible: false,
      isViewFormVisible: false,
    });
  };

  showEditForm = () => {
    this.setState({
      showEventClickDialog: false,
      isCreateFormVisible: false,
      isEditFormVisible: true,
      isViewFormVisible: false,
    });
  };

  showViewEventForm = () => {
    this.setState({
      showEventClickDialog: false,
      isCreateFormVisible: false,
      isEditFormVisible: false,
      isViewFormVisible: true,
    });
  };

  deleteEvent = () => {
    this.eventClickDialogToggle();
    Swal.fire({
      title: "Are you sure?",
      text: "This event will be deleted!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        //make api call
        console.log("Make api call for delete event");
      }
    });
  };

  eventClickDialogToggle = () => {
    this.setState({ showEventClickDialog: !this.state.showEventClickDialog });
  };

  render() {
    return (
      <div style={{ padding: 25, backgroundColor: "white" }}>
        <GridContainer>
          <Grid item xs={8}>
            {this.state.showDialog && (
              <SelectCalendarDialog
                open={this.state.showDialog}
                toggle={this.modalToggle}
                className={this.props.className}
                disableSelectedTime={this.disableSelectedTime}
                showCreateForm={this.showCreateForm}
              />
            )}
            {this.state.showEventClickDialog && (
              <EventClickDialog
                open={this.state.showEventClickDialog}
                toggle={this.eventClickDialogToggle}
                className={this.props.className}
                showEditForm={this.showEditForm}
                deleteEvent={this.deleteEvent}
                showViewEventForm={this.showViewEventForm}
              />
            )}
            <FullCalendar
              defaultView="resourceTimeGridDay"
              plugins={[resourceTimeGridPlugin, interactionPlugin]}
              // defaultView='dayGridMonth'
              // plugins={[dayGridPlugin, interactionPlugin]}
              ref={this.calendarComponentRef}
              weekends={this.state.calendarWeekends}
              resources={this.state.resources}
              minTime={"07:00:00"}
              events={this.getEvents()}
              eventClick={this.handleEventClick}
              navLinks={true}
              selectable={true}
              select={this.handleMultipleSelect}
              //This key is added just for development
              schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
              selectOverlap={false} // ne moze da se selektuje grupno ako je neki izmedju selektovan
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 20, paddingTop: 50 }}>
            {this.state.isCreateFormVisible && (
              <CreateEvent
                selectedStartTime={this.state.selectedStartTime}
                selectedEndTime={this.state.selectedEndTime}
              />
            )}
            {this.state.isEditFormVisible && <EditEvent />}
            {this.state.isViewFormVisible && <ViewEvent />}
          </Grid>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(BookingPage);

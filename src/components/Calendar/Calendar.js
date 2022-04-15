import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';


export default class Calendar extends React.Component {
    render() {
        return (
            <div>
                <FullCalendar 
                defaultView="dayGridMonth" 
                plugins={[dayGridPlugin]} 
                selectable={true}
                />
            </div>
        );
    }
}

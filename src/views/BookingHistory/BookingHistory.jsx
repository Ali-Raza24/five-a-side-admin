import React from "react";
import {withStyles} from "@material-ui/core";
import MaterialTable from "material-table";
import BookingService from '../../services/BookingService';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,

    },
});

class BookingHistory extends React.Component {
    constructor(props) {
        super(props);

        this.bookingService = new BookingService();

        this.state = {
            bookings: []
        }
    }


    render() {
        const {classes} = this.props;
        return (
            <div>
                <React.Fragment>
                    <h1>All Bookings</h1>
                    <MaterialTable
                        className={classes.table}
                        style={{backgroundColor: 'white'}}
                        title="Bookings on all pitches"
                        columns={[
                            {
                                title: 'Venue',
                                field: 'venue'
                            },
                            {
                                title: 'Pitch',
                                field: 'pitch'
                            },
                            {
                                title: 'Starts',
                                field: 'starts_at',
                                type: 'datetime'
                            },
                            {
                                title: 'Interval',
                                field: 'interval',
                                render: rowData => `${rowData.interval} hour${rowData.interval > 1 ? 's' : ''}`
                            },
                            {
                                title: 'Booked at',
                                field: 'created_at',
                                type: 'datetime'
                            },
                        ]}
                        data={
                            query => this.bookingService.getAdminBookings(query.pageSize, (query.page + 1))
                                .then(res => {
                                    this.setState({
                                        bookings: res.data.data
                                    });
                                    return {
                                        data: res.data.data,
                                        page: res.data.meta.current_page - 1,
                                        totalCount: res.data.meta.total
                                    }
                                })
                        }
                        options={{
                            filtering: false
                        }}
                    />
                </React.Fragment>
            </div>
        );
    }
}

export default withStyles(styles)(BookingHistory);
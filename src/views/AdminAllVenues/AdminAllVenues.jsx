import React, { Component } from 'react'
import MaterialTable from 'material-table'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core'
import VenueService from '../../services/VenueService'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

class AdminAllVenues extends Component {
  constructor(props){
    super(props);
    this.state={
      venues: [],
    }
    this.venueService = new VenueService();
  }



  render () {
    const {classes} = this.props;
    return (
      <div>
        <MaterialTable
          columns={[
            { title: 'Name', field: 'name' },
            { title: 'County', field: 'location.county.name' },
            { title: 'City', field: 'location.city.name'},
            { title: 'Address', field: 'address'},
            {title: 'Working Hours', field: 'working_hours'},
            { title: 'Phone', field: 'contact.phone'},
            { title: 'Email', field: 'contact.email'},

          ]}
          data={
            query => this.venueService.getAllVenues(query.pageSize, (query.page+1), query.search)
              .then(res => {
                this.setState({
                  venues: res.data.data
                });
                return {
                  data: res.data.data,
                  page: res.data.meta.current_page - 1,
                  totalCount: res.data.meta.total
                }
              })
          }
          title="All Venues"
          detailPanel={rowData => {
            return (
              <div style={{padding: '20px', background: '#08080808'}}>
                <MaterialTable
                  className={classes.table}
                  style={{backgroundColor: 'white'}}
                  title={`${rowData.name} Pitches`}
                  columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Size', field: 'size', type: 'numeric'}

                  ]}
                  data={
                    query => this.venueService.getVenuePitches(rowData.id)
                      .then(res => {
                        return {
                          data: res.data.data,
                        }
                      })
                  }
                  options={{
                    filtering: false,
                    search: false,
                    paging: false,
                  }}
                />
              </div>

            )
          }}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
        />
      </div>
    )
  }
}

export default withStyles(styles)(AdminAllVenues)
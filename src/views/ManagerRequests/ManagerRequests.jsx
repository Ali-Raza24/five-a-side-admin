import React,{Component} from "react";
import {withStyles} from "@material-ui/core";
import MaterialTable from 'material-table'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';



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

class ManagerRequests extends Component {
  constructor(props) {
    super(props)
    this.state = {
      declinedManager: {},
      acceptedManager: {},
      decline: false,
      accept: false,
      reason: '',
      managers: [
        {
          requestDate: '11-6-2019',
          manager: 'Manager Name',
          county: "County",
          city: "City"
        },
        {
          requestDate: '18-6-2019',
          manager: 'Manager Name',
          county: "County",
          city: "City"
        },
        {
              requestDate: '20-6-2019',
              manager: 'Manager Name',
              county: "County",
              city: "City"
          },
          {
              requestDate: '20-6-2019',
              manager: 'Manager Name',
              county: "County",
              city: "City"
          },
      ]
    }
  };



  handleDeclineOpen = (declinedManager) => {
    this.setState({declinedPayout: declinedManager, decline: true})
  };

  handleDeclineClose = () => {
    this.setState({reason:'', declinedManager: {}, decline: false})
  };

  handleReasonChange = (e) => {
    this.setState({reason: e.target.value});
  };

  handleDecline = () => {
    this.setState({reason: '',decline:false, declinedManager: {}})
  }

  handleAcceptOpen = (acceptedManager) => {
    this.setState({ acceptedManager, accept: true })
  }

  handleAcceptClose = () => {
    this.setState({ acceptedManager: {}, accept: false })
  }

  handleAccept = () => {
    const {managers} = this.state;
    const newManagers = managers.filter((manager) => manager !== this.state.acceptedManager);
    this.setState({managers: newManagers});
    this.setState({accept:false, acceptedManager: {}})
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        {
          <React.Fragment>
            <h1>Pending manager requests</h1>

            <MaterialTable
              className={classes.table}
              style={{backgroundColor: 'white'}}
              title="Pending Venue Manager requests"
              columns={[
                {title: 'Request Date', field: 'requestDate',type: 'datetime'},
                {title: 'Manager', field: 'manager'},
                {title: 'County', field: 'county'},
                {title: 'City', field: 'city'}

              ]}
              data={this.state.managers}
              actions={[
                {
                  icon: 'check',
                  tooltip: 'Accept Manager',
                  onClick: (event, rowData) => this.handleAcceptOpen(rowData)
                },
                {
                  icon: 'delete',
                  tooltip: 'Decline Manager',
                  onClick: (event, rowData) => this.handleDeclineOpen(rowData)
                }
              ]}
              options={{
                actionsColumnIndex: -1,
                filtering: false
              }}
            />
            <Dialog open={this.state.decline} onClose={this.handleDeclineClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Decline Manager</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  In order to decline manager request you have to write reason for that. Reason will be sent to the user that requested to become venue manager.
                </DialogContentText>
                <TextField
                  id="reason"
                  label="Reason"
                  multiline
                  required
                  rows="4"
                  onChange={this.handleReasonChange}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  value={this.state.reason}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleDeclineClose} className={classes.button} color="primary" href="#">
                  Cancel
                </Button>
                <Button onClick={this.handleDecline} disabled={!this.state.reason} className={classes.button} color="primary" href="#">
                  Decline Manager
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={this.state.accept} onClose={this.handleAcceptClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Accept Manager</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You are going to accept request for venue manager. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleAcceptClose} color="primary" href="#">
                  Cancel
                </Button>
                <Button onClick={this.handleAccept}  color="primary" href="#">
                  Accept Manager
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>}
      </div>
    );
  }
}

export default withStyles(styles)(ManagerRequests);
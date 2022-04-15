import React from "react";
import PayoutService from '../../services/PayoutService'
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

class PendingPayouts extends React.Component {
    constructor(props) {
        super(props)
        this.payoutService = new PayoutService();
        this.state = {
            declinedPayout: {},
            acceptedPayout: {},
            decline: false,
            accept: false,
            reason: '',
            payouts: [],
            payoutHistory: []
        };

        this.tableRef = React.createRef();
        this.tableHistory = React.createRef();
    }

    componentDidMount() {
        this.payoutService.getPayoutRequests()
            .then(res => {
                this.setState({
                    payouts: res.data.data,
                })
            });

    }

    finishPayout = (finishedPayout) => {
        const {payouts} = this.state;
        const payoutsNew = payouts.filter((payout) => payout !== finishedPayout);
        this.setState({payouts: payoutsNew});
    };

    handleDeclineOpen = (declinedPayout) => {
        this.setState({declinedPayout, decline: true})
    };

    handleDeclineClose = () => {
        this.setState({reason: '', declinedPayout: {}, decline: false})
    };

    handleReasonChange = (e) => {
        this.setState({reason: e.target.value});
    };

    handleDecline = () => {
        this.payoutService.declinePayoutRequest(this.state.declinedPayout.id, this.state.reason)
            .then(res => {
               this.tableRef.current.onQueryChange();
               this.tableHistory.current.onQueryChange();
            }
            );
        this.setState({reason: '', decline: false, declinedPayout: {}});
    }

    handleAcceptOpen = (acceptedPayout) => {
        this.setState({acceptedPayout, accept: true});
    }

    handleAcceptClose = () => {
        this.setState({acceptedPayout: {}, accept: false})
    }

    handleAccept = () => {
        this.payoutService.acceptPayoutRequest(this.state.acceptedPayout.id)
            .then(res => {
                    this.tableRef.current.onQueryChange();
                    this.tableHistory.current.onQueryChange();
                }
            );
        const {payouts} = this.state;
        const payoutsNew = payouts.filter((payout) => payout !== this.state.acceptedPayout);
        this.setState({payouts: payoutsNew});
        this.setState({accept: false, acceptedPayout: {}});
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                {
                    <React.Fragment>
                        <h1>Pending payouts</h1>

                        <MaterialTable
                            tableRef={this.tableRef}
                            className={classes.table}
                            style={{backgroundColor: 'white'}}
                            title="Pending Payouts"
                            columns={[
                                {title: '#', field: 'id'},
                                {title: 'Manager', field: 'user.name'},
                                {title: 'Amount', field: 'amount'},
                                {title: 'Request Date', field: 'created_at', type: 'datetime'},
                                {title: 'Status', field: 'status'}
                            ]}
                            data={
                                query => this.payoutService.getPayoutRequests(query.pageSize, (query.page + 1), query.search)
                                    .then(res => {
                                        this.setState({
                                            payouts: res.data.data
                                        });
                                        return {
                                            data: res.data.data,
                                            page: res.data.meta.current_page - 1,
                                            totalCount: res.data.meta.total
                                        }
                                    })
                            }
                            actions={[
                                {
                                    icon: 'check',
                                    tooltip: 'Approve Payout',
                                    onClick: (event, rowData) => {
                                        this.handleAcceptOpen(rowData);
                                    }
                                },
                                {
                                    icon: 'delete',
                                    tooltip: 'Decline Payout',
                                    onClick: (event, rowData) => this.handleDeclineOpen(rowData)
                                }
                            ]}
                            options={{
                                actionsColumnIndex: -1,
                                filtering: false,
                                debounceInterval: 500
                            }}
                        />
                        <Dialog open={this.state.decline} onClose={this.handleDeclineClose}
                                aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Decline Payout</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    In order to decline payout you have to write reason for that. Reason will be sent to
                                    the manager that requested payout.
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
                                <Button onClick={this.handleDeclineClose} className={classes.button} color="primary"
                                        href="#">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleDecline} disabled={!this.state.reason}
                                        className={classes.button} color="primary" href="#">
                                    Decline Payout
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={this.state.accept} onClose={this.handleAcceptClose}
                                aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Accept Payout</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    You are going to accept request for payout. Are you sure?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleAcceptClose} color="primary" href="#">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleAccept} color="primary" href="#">
                                    Accept Payout
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>}
                <div style={{paddingTop: '60px'}}>
                    <MaterialTable
                        tableRef={this.tableHistory}
                        className={classes.table}
                        style={{backgroundColor: 'white'}}
                        title="Payout requests history"
                        columns={[
                            {title: '#', field: 'id'},
                            {title: 'Manager', field: 'user.name'},
                            {title: 'Amount', field: 'amount'},
                            {title: 'Request Date', field: 'created_at', type: 'datetime'},
                            {title: 'Status', field: 'status'},
                            {title: 'Status updated', field: 'updated_at', type: 'datetime'}
                        ]}
                        data={
                            query => this.payoutService.getAdminRequestHistory(query.pageSize, (query.page + 1), query.search)
                                .then(res => {
                                    this.setState({
                                        payoutHistory: res.data.data
                                    });
                                    return {
                                        data: res.data.data,
                                        page: res.data.meta.current_page - 1,
                                        totalCount: res.data.meta.total
                                    }
                                })
                        }
                        options={{
                            filtering: false,
                            debounceInterval: 500
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PendingPayouts);
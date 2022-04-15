import React, {Component} from 'react';
import MaterialTable from 'material-table';
import PayoutService from '../../services/PayoutService';

class ManagerPendingPayouts extends Component {

    constructor(props) {
        super(props);

        this.payoutService = new PayoutService();

        this.state = {
            requests: []
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <MaterialTable
                    // tableRef={this.tableRef}
                    className={classes.table}
                    style={{backgroundColor: 'white'}}
                    title="Pending payout requests"
                    columns={[
                        {title: '#', field: 'id'},
                        {title: 'Amount', field: 'amount'},
                        {title: 'Request Date', field: 'created_at', type: 'datetime'},
                        {title: 'Status', field: 'status'}
                    ]}
                    data={
                        query => this.payoutService.getUserPayoutRequests(query.pageSize, (query.page + 1))
                            .then(res => {
                                this.setState({
                                    requests: res.data.data
                                });
                                return {
                                    data: res.data.data,
                                    page: res.data.meta.current_page - 1,
                                    totalCount: res.data.meta.total
                                }
                            })
                    }
                    options={{
                        actionsColumnIndex: -1,
                        filtering: false,
                        debounceInterval: 500,
                        search: false
                    }}
                />
            </div>
        );
    }
}

export default ManagerPendingPayouts;
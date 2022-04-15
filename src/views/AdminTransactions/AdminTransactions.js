import React, {Component} from 'react';
import MaterialTable from 'material-table';
import TokenService from '../../services/TokenService';


class AdminTransactions extends Component {

    constructor(props) {
        super(props);

        this.tokenService = new TokenService();

        this.state = {
            purchases: []
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <React.Fragment>
                    <h1>Token purchase history</h1>
                    <MaterialTable
                        // className={classes.table}
                        style={{backgroundColor: 'white'}}
                        title="Token purchases"
                        columns={[
                            {
                                title: '#',
                                field: 'id'
                            },
                            {
                                title: 'User',
                                field: 'user'
                            },
                            {
                                title: 'Token amount',
                                field: 'token_amount'
                            },
                            {
                                title: 'Total',
                                field: 'total'
                            },
                            {
                                title: 'Status',
                                field: 'status'
                            },
                            {
                                title: 'Charge ID',
                                field: 'charge_id'
                            },
                            {
                                title: 'Charged At',
                                field: 'updated_at',
                                type: 'datetime'
                            },
                        ]}
                        data={
                            query => this.tokenService.getTokenPurchases(query.pageSize, (query.page + 1), query.search)
                                .then(res => {
                                    this.setState({
                                        purchases: res.data.data
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
                </React.Fragment>
            </div>
        );
    }
}

export default AdminTransactions;
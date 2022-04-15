import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import React, { Component } from 'react';


export default class SelectCalendaDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.toggle} aria-labelledby="simple-dialog-title"
                >
                    <DialogTitle id="simple-dialog-title">Choose action</DialogTitle>
                    <div>
                        <ListItem button onClick={this.props.showCreateForm}>
                            <ListItemAvatar>
                                <Avatar>
                                    <AddIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Create new event" />
                        </ListItem>
                        <ListItem button onClick={this.props.disableSelectedTime}>
                            <ListItemAvatar>
                                <Avatar>
                                    <DeleteOutlinedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Cancel selected time" />
                        </ListItem>
                    </div>
                </Dialog>
            </div>
        );
    }
}
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import ChevronRight from '@material-ui/icons/ChevronRight';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import React, { Component } from 'react';


export default class EventClickDialog extends Component {
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
                        <ListItem button onClick={this.props.showViewEventForm}>
                            <ListItemAvatar>
                                <Avatar>
                                    <ChevronRight />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="View event" />
                        </ListItem>
                        <ListItem button onClick={this.props.showEditForm}>
                            <ListItemAvatar>
                                <Avatar>
                                    <EditIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Edit event" />
                        </ListItem>
                        <ListItem button onClick={this.props.deleteEvent}>
                            <ListItemAvatar>
                                <Avatar>
                                    <DeleteOutlinedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Delete event" />
                        </ListItem>
                    </div>
                </Dialog>
            </div>
        );
    }
}
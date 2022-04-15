import React, { Component } from 'react';

export default class ViewEvent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <p className="text-left text-big mb-4" >
                   Here will be displayed specific event.
                </p>
            </React.Fragment>
        );
    }
}


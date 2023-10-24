import React, { Component, Fragment } from 'react';

import {
    EuiIcon,
    EuiHealth,
    EuiTitle
} from '@elastic/eui';


export class APIStatus extends Component {

    constructor(props) {
    
        super(props);

    }

    componentDidMount() {
        // setInterval(() => this.totalAlerts(), 1000);
        // setInterval(() => this.failedAlerts(), 1000);
    }

    render() {
        const color = 'green';
        const label = 'API is running';

        return (
            <Fragment>
                <EuiTitle size="s">
                    <h1>
                        <EuiIcon type="logoElasticStack" size="xl" />
                        &nbsp;BA Alert&nbsp;&nbsp;
                        <EuiHealth color={color}>{label}</EuiHealth>
                    </h1>
                </EuiTitle>
            </Fragment>
        );
    }
}


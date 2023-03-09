import React, { Component, Fragment } from 'react';

import {
  EuiTabbedContent,
  EuiIcon,
} from '@elastic/eui';

import { Rules } from "../rules";

export class Tabs extends Component {
 


  render() {
    return (
      <Fragment>
        <EuiTabbedContent
            tabs={[
                {
                id: 'kibana-alerts',
                name: (
                    <span>
                      <EuiIcon type="heatmap" />
                      &nbsp;Kibana Alerts
                    </span>
                  ),
                content: (
                    <Fragment>
                        <Rules />  
                    </Fragment>
                ),
                },
                {
                id: 'bitbucket-alerts',
                name: 'Bitbucket Alerts',
                content: (
                    <Fragment>
                        test
                    </Fragment>
                ),
                },
            ]}
        />
      </Fragment>
    );
  }
}

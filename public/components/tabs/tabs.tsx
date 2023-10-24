import React, { Component, Fragment } from 'react';

import {
  EuiTabbedContent,
  EuiIcon,
} from '@elastic/eui';

import { RulesList } from "../rules_list";
import { RulesListBitbucket } from "../rules_list_bitbucket"

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
                        <RulesList />  
                    </Fragment>
                ),
                },
                {
                id: 'bitbucket-alerts',
                name: (
                    <span>
                      <EuiIcon type="color" />
                      &nbsp;Bitbucket Alerts
                    </span>
                ),
                content: (
                    <Fragment>
                        <RulesListBitbucket />
                    </Fragment>
                ),
                },
            ]}
        />
      </Fragment>
    );
  }
}

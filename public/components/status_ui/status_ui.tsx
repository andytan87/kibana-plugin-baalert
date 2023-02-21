import React, { Component, Fragment } from 'react';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiIcon,
  EuiHealth,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiText,
  EuiTextColor,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiStat,
} from '@elastic/eui';

import {
  setHttpClient,
  analyze,
  multiAnalyze
} from "../../services/api";

import {loadSavedState, saveState} from "../../services/state_handler";

export class StatusUI extends Component {
  constructor(props) {
    super(props);
    const params = loadSavedState();
    this.state = {
      params: params,
      errors: {}
    };

    setHttpClient(this.props.httpClient);

  };

  

  render() {
    return (
      <Fragment>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiPanel hasBorder={true}>
                  <EuiStat
                    title="50"
                    textAlign="center"
                    titleColor="default"
                    description={
                      <EuiTextColor color="default">
                        <span>
                          <EuiIcon type="clock" color="accent" /> 100%
                        </span>
                      </EuiTextColor>
                    }
                  >
                    Total Alerts
                  </EuiStat>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel hasBorder={true}>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiStat
                    title="50"
                    textAlign="center"
                    titleColor="success"
                    description={
                      <EuiTextColor color="success">
                        <span>
                          <EuiIcon type="clock" color="success" /> 70,29%
                        </span>
                      </EuiTextColor>
                    }
                  >
                    Successful Alerts
                  </EuiStat>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    );
  }
}

import React, { Component, Fragment, useState } from 'react';

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
  getSuccessfullAlerts,
  getTotalAlerts,
  getFailedAlerts,
} from "../../services/api";

import { CoreStart } from '../../../../../src/core/public';

import {loadSavedState, saveState} from "../../services/state_handler";

export class StatusUI extends Component {
  constructor(props) {
    super(props);
    const params = loadSavedState();
    this.state = {
      params: params,
      errors: {},
      failedAlert: "-",
      successfullAlert: "-",
      totalAlert: "-",
      time: new Date()
    };

    setHttpClient(this.props.httpClient);

  };


  failedAlerts() {
    const result = getFailedAlerts();
    result.then(
      (response) => {
        // console.log(response)
        this.setState({
          showResult: true,
          failedAlert: response.message
        });
      }
    ).catch(
      error => {
        if (error.body) {
          if (error.body.statusCode == 404) {
            this.setState({
              errors: {
                indexNameError: error.body.message
              }
            })
          } else if (error.body.statusCode == 400) {
            this.setState({
              errors: {
                analyzerError: error.body.message
              }
            });
          } else {
            //TODO Notification
            console.error(error);
          }
        } else {
          //TODO Notification
          console.error(error);
        }
      }
    );
  }


  totalAlerts() {
    const result = getTotalAlerts();
    result.then(
      (response) => {
        // console.log(response)
        this.setState({
          showResult: true,
          totalAlert: response.message
        });
      }
    ).catch(
      error => {
        if (error.body) {
          if (error.body.statusCode == 404) {
            this.setState({
              errors: {
                indexNameError: error.body.message
              }
            })
          } else if (error.body.statusCode == 400) {
            this.setState({
              errors: {
                analyzerError: error.body.message
              }
            });
          } else {
            //TODO Notification
            console.error(error);
          }
        } else {
          //TODO Notification
          console.error(error);
        }
      }
    );
  }

  successfullAlerts() {
    const result = getSuccessfullAlerts();
    result.then(
      (response) => {
        // console.log(response)
        this.setState({
          showResult: true,
          successfullAlert: response.message
        });
      }
    ).catch(
      error => {
        if (error.body) {
          if (error.body.statusCode == 404) {
            this.setState({
              errors: {
                indexNameError: error.body.message
              }
            })
          } else if (error.body.statusCode == 400) {
            this.setState({
              errors: {
                analyzerError: error.body.message
              }
            });
          } else {
            //TODO Notification
            console.error(error);
          }
        } else {
          //TODO Notification
          console.error(error);
        }
      }
    );
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  componentDidMount() {
    setInterval(() => this.totalAlerts(), 1000);
    setInterval(() => this.successfullAlerts(), 1000);
    setInterval(() => this.failedAlerts(), 1000);

  }

  render() {
    return (
      <Fragment>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiPanel hasBorder={true}>
              <a href="">
                  <EuiStat
                    title={this.state.totalAlert.toString()}
                    textAlign="center"
                    titleColor="default"
                    description={
                      <EuiTextColor color="default">
                      </EuiTextColor>
                    }
                  >
                    Total Alerts
                  </EuiStat>
                  </a>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel hasBorder={true}>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <a href="">
                  <EuiStat
                    title={this.state.successfullAlert.toString()}
                    textAlign="center"
                    titleColor="success"
                    description={
                      <EuiTextColor color="success">
                      </EuiTextColor>
                    }
                  >
                    Successful Alerts
                  </EuiStat>
                  </a>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel hasBorder={true}>
              <EuiFlexGroup>
                <EuiFlexItem>
                <a href="">
                  <EuiStat
                    title={this.state.failedAlert.toString()}
                    textAlign="center"
                    titleColor="danger"
                    description={
                      <EuiTextColor color="dangeopr">
                      </EuiTextColor>
                    }
                  >
                    Failed Alerts
                  </EuiStat>
                  </a>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    );
  }
}

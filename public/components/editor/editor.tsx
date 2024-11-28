import React, { Component, useState } from 'react';
import {
  EuiCodeEditor,
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer
} from '@elastic/eui';
import 'brace/mode/yaml';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import { addToast } from '../toast';
import axios from 'axios';
import https from 'https';

import { Console } from './console';

const agent = new https.Agent({  
  rejectUnauthorized: false
});

export class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      ruleName: '',
      teamName: '',
      isModalVisible: false,
      isModalVisibleConsole: false,
      saving: false,
      testing: false,
      testResponse: null,
      testFailed: null,
      refresh: false
    };

    this.props.loadRule = this.loadRule.bind(this);
  }
  
  loadTeams = () => {
    axios.get(`../api/baalert/test`, { httpsAgent: agent })
        .then(res => {
            let rules_list = res.data.directories.sort();
            rules_list = this.create_dictionary(rules_list);
            this.setState({ rules_list });
        }).catch((err) => {
            const errorMessage = err;
            this.setState({ errorMessage })
        });
};

  loadRule() {
    axios({
      method: 'get',
      url: `../api/elastalert/rules/${this.props.ruleDir}/${this.props.ruleName}`,
      httpsAgent: agent
    }).then(resp => {
      this.setState({ value: resp.data.data, ruleName: this.props.rule })
    }).catch((err) => {
      console.log("error: " + err)
      this.setState({ errorMessage: false });
  })

  }
  
  saveRule = () => {
    // const { httpClient } = this.props;
    this.setState({ saving: true });
    const ruleID = this.props.editorMode === 'edit' ? this.props.ruleName  : this.state.ruleName;
    const teamID = this.props.editorMode === 'edit' ? this.props.ruleDir : this.state.teamName;


    axios({
      method: 'post',
      url: `../api/elastalert/rules/${teamID}/${ruleID}`,
      data: {
        yaml: this.state.value
      },
      headers: {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'anything',
        'Accept': 'application/json, text/plain, */*'
      },
      httpsAgent: agent
    }).then(resp => {
      if (resp.status === 200) {
        this.setState({ saving: false });
        addToast({
          title: "Saved successfully", 
          text: `Rule '${ruleID}' was saved successfully`,
          color: "success",
        });
        this.closeModal();
        // if (this.props.editorMode !== 'edit') {
        //   window.location.reload();
        // }

        // this.props.updateRuleList();
      }
    }).catch(e => {
      console.log("error cuy")
      console.log(e)
      this.setState({ saving: false });
      addToast({
        title: "Failed to save", 
        text: `Rule '${ruleID}' could not be saved: (${e})`,
        color: "danger",
      });
    });

    
  };

  testRule = () => {
    // const { httpClient } = this.props;
    const ruleID = this.props.editorMode === 'edit' ? this.props.ruleName : this.state.ruleName;
    const teamID = this.props.editorMode === 'edit' ? this.props.ruleDir : this.state.teamName;
    this.setState({ testing: true, testFailed: null, testResponse: null });

    axios({
      method: 'post',
      url: `../api/elastalert/stream/${teamID}/${ruleID}`,
      data: {
        yaml: this.state.value
      },
      headers: {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'anything',
        'Accept': 'application/json, text/plain, */*'
      },
      httpsAgent: agent
    })
      .then(resp => {
        this.setState({
          testing: false,
          testFailed: false,
          testResponse: resp.data.data,
          isModalVisibleConsole: true,
        })

      }).catch(err => {
        this.setState({
          testing: false,
          testFailed: true,
          testResponse: err.data ? err.data : err.data,
        })
        console.log(err)
        addToast({
          title: "Failed to run test", 
          text: `Test '${ruleID}': (${err})`,
          color: "danger",
        });
      });
  };

  onChange = value => {
    this.setState({ value: value });
  };

  setRuleName = e => {
    this.setState({ ruleName: e.target.value });
  };

  setTeamName = e => {
    this.setState({ teamName: e.target.value });
  }

  closeModal = () => {
    if (this.props.editorMode === 'edit') {
      // this.forceUpdate()
      this.setState({ isModalVisible: false });
      window.location.reload(false);
    } else {
      this.setState({ value: '', ruleName: '', isModalVisible: false });
    }
  };

  closeModalConsole = () => {
    this.setState({ testResponse: '', isModalVisibleConsole: false })
  }

  showModal = () => {
    if (this.props.editorMode === 'edit') {
      // this.props.loadRule();
    }
    this.setState({ isModalVisible: true, testResponse: null });
  };

  componentDidMount() {
    if (this.props.editorMode === 'edit') {
      this.loadRule();
      this.setState({ isModalVisible: true, testResponse: null  });
    }
  }
  
  componentWillReceiveProps() {
    if (this.props.editorMode === 'edit') {
      this.loadRule();
      this.setState({ isModalVisible: true, testResponse: null  });
    }
  }


  render() {
    let modal;

    let modalConsole;

    if (this.state.testResponse && this.state.isModalVisibleConsole) {
      modalConsole = (
        <EuiOverlayMask>
          <EuiModal onClose={this.closeModalConsole} style={{ width: '900px' }}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                Test Output
            </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
              <Console testResponse={this.state.testResponse} />
            </EuiModalBody>
            <EuiModalFooter>

            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>

      )
    }

    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask>
          <EuiModal onClose={this.closeModal} style={{ width: '900px' }}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                {this.props.editorMode === 'edit' ? 'Edit' : 'Create'} rule
              </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
              <EuiFormRow label="Rule name">
                <EuiFieldText
                  name="ruleName"
                  value={this.props.editorMode === 'edit' ? this.props.ruleName : this.state.ruleName}
                  onChange={this.setRuleName}
                  readOnly={this.props.rule ? true : false}
                  autoFocus={true}
                />
              </EuiFormRow>
              <EuiFormRow label="Team name">
                <EuiFieldText
                  name="teamName"
                  value={this.props.editorMode === 'edit' ? this.props.ruleDir : this.state.teamName}
                  onChange={this.setTeamName}
                  readOnly={this.props.rule ? true : false}
                />
              </EuiFormRow>
              <EuiCodeEditor
                mode="yaml"
                theme="github"
                width="100%"
                height="400px"
                value={this.state.value}
                onChange={this.onChange}
                setOptions={{
                  fontSize: '14px',
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true
                }}
              />
            </EuiModalBody>
            <EuiModalFooter>
            <EuiButtonEmpty onClick={() => { this.closeModal(); }}>Cancel</EuiButtonEmpty>
              <EuiButton onClick={this.testRule} isLoading={this.state.testing}>
                {this.state.testing ? 'Testing..' : 'Test'}
              </EuiButton>
              <EuiButton
                fill
                onClick={this.saveRule}
                isLoading={this.state.saving}
              >
                {this.state.saving ? 'Saving..' : 'Save'}
              </EuiButton>

            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }


    if (this.props.editorMode === 'create') {
      return (
        <div>
          <EuiButton
            onClick={this.showModal}
            fill={this.props.editorMode === 'edit' ? false : true}
          >
            {this.props.editorMode === 'edit' ? 'Edit rule' : 'Create rule'}
          </EuiButton>
          {modal}
          {modalConsole}
        </div>
      );
    } else if (this.props.editorMode === 'edit') {
      return (
        <div >
          {modal}
          {modalConsole}
        </div>
      )
    }

  }
}
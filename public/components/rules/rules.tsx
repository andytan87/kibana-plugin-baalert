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
  EuiBasicTable,
  EuiLink,
  EuiInMemoryTable
} from '@elastic/eui';

import axios from 'axios';
import https from 'https';


export class Rules extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isModalDeployVisible: false,
      isDestroyModalVisible: false,
      isEmptyModalVisible: false,
      pageIndex: 0,
      pageSize: 5,
      showPerPageOptions: true,
      rules: [],
      selectedItem: [],
      ruleName: '',
      refresh: false
    };
  }

  componentDidMount() {
    console.log("mantapgan")
    axios.get('http://localhost:3000/rules/' + this.props.rule_dir)
      .then(res => {
        this.setState({ rules: res.data.rules });
        console.log(res.data.rules)
      }).catch(error => {
        console.log(error);
      });
  };

  deleteRule = user => {
    console.log("test")
  }

  editRule = user => {
    console.log("test")
  }

  render() {

    const search = {
      onChange: this.onQueryChange,
      box: {
          incremental: true,
      },
    };


    const actions = [{
      name: 'Clone',
      description: 'Edit this rule',
      icon: 'copy',
      type: 'icon',
      onClick: this.editRule,
    }, {
      name: 'Delete',
      description: 'Delete this rule',
      icon: 'trash',
      type: 'icon',
      color: 'danger',
      onClick: this.deleteRule,
    }];

    const columns = [{
      field: 'ruleName',
      name: 'Rule Name',
      sortable: true,
      hideForMobile: true,
      'data-test-subj': 'firstNameCell',
    },
    {
      field: 'firstName',
      name: 'Full Name',
      isMobileHeader: true,
    },
    {
      field: 'nationality',
      name: 'Type',
      sortable: true,
      hideForMobile: true,
      'data-test-subj': 'firstNameCell',
    }, {
      field: 'online',
      name: 'Status',
      dataType: 'boolean',
      render: (online) => {
        const color = online ? 'success' : 'danger';
        const label = online ? 'Running' : 'Error';
        return <EuiHealth color={color}>{label}</EuiHealth>;
    }
    },
    {
      name: 'Actions',
      actions
    },
    ];



    const store = this.state.rules;

    const items = store;

    // const selection = {
    //   selectable: (user) => user.online,
    //   selectableMessage: (selectable) => !selectable ? 'User is currently offline' : undefined,
    //   onSelectionChange: this.onSelectionChange
    // };

    return (
      <Fragment>
        <br></br>
        {/* <EuiText>
          <h1>API Backend Not Found</h1>
        </EuiText> */}
        <EuiInMemoryTable
          itemId="id"
          items={items}
          columns={columns}
          pagination={true}
          sorting={true}
          hasActions={true}
          search={search}
          // selection={selection}
          responsive={true}
          tableLayout='fixed'
        />
      </Fragment>
    );
  }
}

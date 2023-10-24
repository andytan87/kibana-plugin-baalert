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
  EuiOverlayMask,
  EuiConfirmModal,
  EuiInMemoryTable,
  EUI_MODAL_CONFIRM_BUTTON
} from '@elastic/eui';

import { Editor } from "../editor";

import axios from 'axios';
import https from 'https';

let deleteId;
let prodId;
let editorEdit;
let ruleId;
let ruleDir;


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


  loadRules = () => {
    axios.get(`../api/elastalert/rules/` + this.props.rule_dir, { httpsAgent: agent })
        .then(res => {
            this.setState({ rules: res.data.rules })
        }).catch((err) => {
            this.setState({ errorMessage: false });
        });

}

  componentDidMount() {
    axios.get(`../api/elastalert/rules/` + this.props.rule_dir)
      .then(res => {
        this.setState({ rules: res.data.data.rules });
      }).catch(error => {
        console.log(error);
      });
      this.forceUpdate()
  };

  closeDestroyModal = () => {
    this.setState({ isDestroyModalVisible: false });
  }

  showDestroyModal = () => {
    this.setState({ isDestroyModalVisible: true });
  }

  closeModal = () => {
    this.setState({ isModalVisible: false });
  }

  getRowProps = (item) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: () => console.log(`Clicked row ${id}`),
    };
  };

  getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      className: 'customCellClass',
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };


  refreshPage = () => {
    console.log("refresh page")
    // this.setState({ refresh: true });
    this.forceUpdate();
  }

  deleteRule = user => {
    deleteId = user.ruleName;
    this.setState({ isDestroyModalVisible: true, isModalVisible: false });
  }

  editRule = user => {
    console.log("editRule")
    console.log(user)
    ruleDir = this.props.rule_dir;
    ruleId = user.ruleName;
    this.setState({ isModalVisible: true });
  }

  prodDeploy = user => {
    prodId = user.ruleName;
    this.setState({ isModalDeployVisible: true, isDestroyModalVisible: false, isModalVisible: false });
  }

  closeProdDeploy = () => {
    this.setState({ isModalDeployVisible: false });
  }

  deleteConfirm = rule => {
    console.log(deleteId)

    axios({
      url: '../api/elastalert/rules/' + this.props.rule_dir + '/' + deleteId,
      method: 'delete',
      httpsAgent: agent,
      headers: {
        "kbn-xsrf": 'anything'
      }
    })
      .then(res => {
        console.log("tests");
        addToast('Delete Sucessfully', "The rule " + deleteId + " was sucessfully deleted<br/>test", 'success');
        this.loadRules();
      }).catch((err) => {
        addToast("Delete Failed", "Cannot delete " + deleteId + " <br>Reason: " + err.message, 'danger');
      });

    this.setState({ isDestroyModalVisible: false });

  }

  render() {

    if (this.state.isModalVisible) {
      editorEdit = (
        <Editor editorMode="edit" ruleName={ruleId} ruleDir={ruleDir} />
      )
    }

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


    // const store = this.state.rules

    let destroyModal;
    let deployModal;

    if (this.state.isDestroyModalVisible) {
      destroyModal = (
        <EuiOverlayMask>
          <EuiConfirmModal
            title="You will delete the alert"
            onCancel={this.closeDestroyModal}
            onConfirm={this.deleteConfirm}
            cancelButtonText="No"
            confirmButtonText="Yes"
            buttonColor="danger"
            defaultFocusedButton={EUI_MODAL_CONFIRM_BUTTON}
          >
            <p>You will delete <b>{deleteId}</b></p>
            <p>Are you sure you want to delete it?</p>
          </EuiConfirmModal>
        </EuiOverlayMask>
      );
    }

    if (this.state.isModalDeployVisible) {
      deployModal = (
        <EuiOverlayMask>
          <EuiConfirmModal
            title="You will will deploy this rule"
            onCancel={this.closeProdDeploy}
            onConfirm={this.deployConfirm}
            cancelButtonText="No"
            confirmButtonText="Yes"
            buttonColor="danger"
            defaultFocusedButton={EUI_MODAL_CONFIRM_BUTTON}
          >
            <p>You will will deploy this rule <b>{prodId}</b></p>
            <p>Are you sure you want to deploy this rule to Production ?</p>
          </EuiConfirmModal>
        </EuiOverlayMask>
      );
    }

    let emptyModal;



    const columns = [{
      field: 'ruleName',
      name: 'Rule Name',
      sortable: true,
      hideForMobile: true,
      'data-test-subj': 'firstNameCell',
    },
    // {
    //   field: 'firstName',
    //   name: 'Full Name',
    //   isMobileHeader: true,
    // },
    // {
    //   field: 'nationality',
    //   name: 'Type',
    //   sortable: true,
    //   hideForMobile: true,
    //   'data-test-subj': 'firstNameCell',
    // },
    // {
    //   field: 'online',
    //   name: 'Status',
    //   dataType: 'boolean',
    //   render: (online) => {
    //     const color = online ? 'success' : 'danger';
    //     const label = online ? 'Running' : 'Error';
    //     return <EuiHealth color={color}>{label}</EuiHealth>;
    //   }
    // },
    {
      name: 'Actions',
      actions
    },
    ];


    const store = this.state.rules;

    const items = store;

    const selection = {
      selectable: (user) => user.online,
      selectableMessage: (selectable) => !selectable ? 'User is currently offline' : undefined,
      onSelectionChange: this.onSelectionChange
    };

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
        {editorEdit}
        <br></br>
        {destroyModal}
        <br></br>
        {deployModal}
      </Fragment>
    );
  }
}

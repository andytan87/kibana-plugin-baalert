import React, { Fragment, useState } from 'react';
import axios from 'axios';

import https from 'https';


import {
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiText,
    EuiHealth,
    EuiButtonIcon,
    EuiLink,
    EuiCallOut,
    EuiLoadingChart,
    EuiInMemoryTable,
    EuiButton,
    EuiDescriptionList,
    EuiHorizontalRule,
    EuiBasicTable,
    LEFT_ALIGNMENT,
    CENTER_ALIGNMENT
} from '@elastic/eui';
// import { METHODS } from 'http';

import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';

import { Rules } from "../rules";

import { Editor } from "../editor";

import { METHODS } from 'http';

const agent = new https.Agent({
    rejectUnauthorized: false
});

export class RulesListBitbucket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rules_list: [],
            rules_definition: [],
            errorMessage: '',
            reloadTable: '',
            itemIdToExpandedRowMap: {},
            container_list: [],
        };



        this.loadTeams = this.loadTeams.bind(this);
    };


    updateTableOnSave() {
        this.setState({ reloadTable: 'yes' })
    }

    get_online_status(container_status) {
        
        let result = false;
        console.log("before container status " + container_status)
        let container_name = 'elastalert-bitbucket-' + container_status.toLowerCase().replaceAll("_","-")

        console.log("after container status " + container_name)

        console.log("container name " + container_name)

        for (const container of this.state.container_list.keys()) {

           
            if (container_name in this.state.container_list[container] === true) {

                result = this.state.container_list[container][container_name]
            } 
            else {
                
            }


        }

        return result

    };

    create_dictionary(rules) {
        const list = []
        for (const test of rules.keys()) {
            console.log("mantaptest")

            console.log("rules " + rules[test])

            let container_status = this.get_online_status(rules[test])
            console.log("container status " + container_status)

            list.push({ id: test, ruleName: rules[test], online: container_status })
        }

        return list
    };


    async getUserAccount() {
        await axios.get(`../api/elastalert/containerstatus-bitbucket`, { httpsAgent: agent })
            .then(res => {
                console.log(res.data.data)
                let container_list = res.data.data.sort();

                this.setState({ container_list });
                console.log(this.state.container_list)
            }).catch((err) => {
                const errorMessage = err;
                this.setState({ errorMessage })
            });
    }

    async getUserPermissions() {
        await axios.get(`../api/baalert/bitbucket`, { httpsAgent: agent })
            .then(res => {
                let rules_list = res.data.directories.sort();
                rules_list = this.create_dictionary(rules_list);

                this.setState({ rules_list });
            }).catch((err) => {
                const errorMessage = err;
                this.setState({ errorMessage })
            });
    }


    async componentDidMount() {

        // axios.get(`../api/elastalert/containerstatus`, { httpsAgent: agent })
        //     .then(res => {
        //         console.log(res.data.data)
        //         let container_list = res.data.data.sort();

        //         this.setState({ container_list });
        //         console.log(this.state.container_list)
        //     }).catch((err) => {
        //         const errorMessage = err;
        //         this.setState({ errorMessage })
        //     });

        axios.get(`../api/elastalert/containerstatus-bitbucket`, { httpsAgent: agent })
            .then(res => {
                console.log("container status")
                console.log(res.data.data)
                let container_list = res.data.data.sort();

                this.setState({ container_list });
                console.log(this.state.container_list)
                return axios.get(`../api/baalert/bitbucket`, { httpsAgent: agent })
                    .then(res => {

                        let rules_list = res.data.directories.sort();
                        rules_list = this.create_dictionary(rules_list);

                        this.setState({ rules_list });
                        return
                    }).catch((err) => {
                        const errorMessage = err;
                        this.setState({ errorMessage })
                    });

            }).catch((err) => {
                const errorMessage = err;
                this.setState({ errorMessage })
            });



        // axios.all([this.getUserAccount(), this.getUserPermissions()])
        //     .then(axios.spread(function (acct, perms) {
        //         // Both requests are now complete
        //     }));
    }

    buttonContent = item => {
        let team = item.ruleName.toLowerCase()
        window.open("https://elk.sdst.sbaintern.de/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'12adf4a0-739e-11ec-ab24-d76c708bdd56',key:kubernetes.pod_name,negate:!f,params:(query:elastalert-" + team +  ",type:phrase),type:phrase,value:elastalert-" + team +  "),query:(match:(kubernetes.pod_name:(query:elastalert-" + team + ",type:phrase))))),index:'12adf4a0-739e-11ec-ab24-d76c708bdd56',interval:auto,query:(language:lucene,query:''),sort:!(_score,desc))", '_blank').focus();
    };

    showBitbucketLink = item => {
        let team = item.ruleName
        window.open("https://bitbucket.webapp.sdst.sbaintern.de/projects/ELK/repos/elastalert-rules/browse/" + team)
    }
 
    toggleDetails = item => {
        const itemIdToExpandedRowMapValues = this.state.itemIdToExpandedRowMap;
        console.log(itemIdToExpandedRowMapValues)
        if (itemIdToExpandedRowMapValues[item.id]) {
            delete itemIdToExpandedRowMapValues[item.id];
        } else {
            const { nationality, online } = item;
            const country = {
                "code": 'NL',
                "name": 'Netherlands',
                "flag": '🇳🇱'
            };
            const color = online ? 'success' : 'danger';
            const label = online ? 'Online' : 'Offline';
            const listItems = [
                {
                    title: 'Nationality',
                    description: `${country.flag} ${country.name}`,
                },
                {
                    title: 'Online',
                    description: <EuiHealth color={color}>{label}</EuiHealth>,
                },
            ];
            itemIdToExpandedRowMapValues[item.id] = (
                <Rules rule_dir={item.ruleName} />
            );
        }
        this.setState(itemIdToExpandedRowMapValues);
    };

    loadTeams = () => {
        axios.get(`../api/baalert/bitbucket`, { httpsAgent: agent })
            .then(res => {
                let rules_list = res.data.directories.sort();
                rules_list = this.create_dictionary(rules_list);
                this.setState({ rules_list });
            }).catch((err) => {
                const errorMessage = err;
                this.setState({ errorMessage });
            });
    };

    render() {



        const renderToolsRight = () => {
            return [
                <EuiButton
                    key="loadUsers"
                    onClick={this.loadTeams}
                >
                    Load Teams
                </EuiButton>
            ];
        };

        const search = {
            toolsRight: renderToolsRight(),
            onChange: this.onQueryChange,
            box: {
                incremental: true,
            },
        };


        const actions = [{
            name: 'Logs',
            description: 'Edit this rule',
            icon: 'notebookApp',
            type: 'icon',
            onClick: item => (
                this.showBitbucketLink(item)),
        },
        {
            name: 'Logs',
            description: 'Edit this rule',
            icon: 'inspect',
            type: 'icon',
            onClick: item => (
                this.buttonContent(item)),
        }
        ];

        const items = this.state.rules_list;

        const columns = [
            {
                align: LEFT_ALIGNMENT,
                width: '300px',
                field: 'ruleName',
                name: 'TEAM',
                sortable: true,
            },

            {
                align: LEFT_ALIGNMENT,
                width: '50px',
                field: 'online',
                name: 'Container Status',
                dataType: 'boolean',
                render: (online) => {
                    const color = online ? 'success' : 'danger';
                    const label = online ? 'Running' : 'Error';
                    return <EuiHealth color={color}>{label}</EuiHealth>;
                }
            },
            {
                name: "Actions",
                width: "800px",
                actions
            }

        ];


        if (this.state.errorMessage) {
            return (
                <div>
                    <EuiPageContent>
                        <EuiPageContentHeader>
                            <EuiPageContentHeaderSection>
                                <EuiTitle>
                                    <h2>Rules</h2>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <EuiPageContentBody>
                            <EuiText>
                                <EuiCallOut
                                    title="einen Fehler ist aufgetaucht"
                                    color="danger"
                                    iconType="cross"
                                >
                                    <p>
                                        API Error: {this.state.errorMessage.message}.
                                        Bitte kontaktieren sie <EuiLink href="mailto:_BA-IT-Systemhaus-OPS1-ELK@arbeitsagentur.de">_BA-IT-Systemhaus-OPS1-ELK</EuiLink>
                                    </p>
                                </EuiCallOut>
                            </EuiText>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </div>

            )

        }

        if (!this.state.errorMessage && this.state.rules_list.length > 0) {
            return (
                <Fragment>
                    <EuiPageContent>
                        <EuiPageContentHeader>
                            <EuiPageContentHeaderSection>
                                <EuiTitle>
                                    <h2>Rules</h2>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                            <EuiPageContentHeaderSection>
                                <Editor editorMode="create" loadTeams={() => this.loadTeams()} />
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <EuiHorizontalRule />
                        <EuiPageContentBody>
                            <EuiInMemoryTable
                                itemId="id"
                                items={items}
                                columns={columns}
                                hasActions={true}
                                search={search}
                                sorting={true}
                                responsive={true}
                                tableLayout='auto'
                                isExpandable={true}
                                pagination={true}
                                itemIdToExpandedRowMap={this.state.itemIdToExpandedRowMap}
                            />
                            <br></br>
                        </EuiPageContentBody>
                    </EuiPageContent>

                </Fragment>

            )
        }
        return (

            <h2><EuiLoadingChart size="xl" />&nbsp;&nbsp;<font size="5">Loading</font></h2>

        )


    }

}

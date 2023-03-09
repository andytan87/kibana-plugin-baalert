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
    EuiDescriptionList,
    EuiBasicTable,
    LEFT_ALIGNMENT,
    CENTER_ALIGNMENT
} from '@elastic/eui';
// import { METHODS } from 'http';

import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';

import { Rules } from "../rules";

import { METHODS } from 'http';

const agent = new https.Agent({
    rejectUnauthorized: false
});

export class RulesList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rules_list: [],
            rules_definition: [],
            errorMessage: '',
            reloadTable: '',
            itemIdToExpandedRowMap: {},
        };



        // this.updateTableOnSave = this.updateTableOnSave.bind(this)
    };


    // updateTableOnSave() {
    //     this.setState({ reloadTable: 'yes' })
    // }

    create_dictionary(rules) {
        const list = []
        console.log(rules)
        for (const test of rules.keys()) {
            list.push({ id: test, ruleName: rules[test], online: true })
        }

        return list
    }

    componentDidMount() {
        console.log("huahuahua")
        axios.get(`../api/baalert/test`, { httpsAgent: agent })
            .then(res => {
                let rules_list = res.data.directories.sort();
                rules_list = this.create_dictionary(rules_list);
                this.setState({ rules_list });
            }).catch((err) => {
                const errorMessage = err;
                this.setState({ errorMessage })
            });

        // const rules_list = ["test"];
        // this.setState({ rules_list });
    }

    buttonContent = test => {
        window.open("https://elk.sdst.sbaintern.de/", '_blank').focus();
    };

    toggleDetails = item => {
        console.log(item)
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


    render() {

        const search = {
            onChange: this.onQueryChange,
            box: {
                incremental: true,
            },
        };


        const actions = [{
            name: 'Logs',
            description: 'Edit this rule',
            icon: 'inspect',
            type: 'icon',
            onClick: this.buttonContent,
        }];



        // const items = [{
        //     id: '1',
        //     ruleName: 'OPS1-ELK',
        //     "lastName": 'doe',
        //     "github": 'johndoe',
        //     "dateOfBirth": "2020-01-01",
        //     "nationality": 'NL',
        //     "online": 'true'
        //   },
        //   {
        //     id: '2',
        //     ruleName: 'test',
        //     "lastName": 'doe',
        //     "github": 'johndoe',
        //     "dateOfBirth": "2020-01-01",
        //     "nationality": 'NL',
        //     "online": 'true'
        //   }]

        const items = this.state.rules_list;

        const columns = [
            {
                align: LEFT_ALIGNMENT,
                width: '40px',
                isExpander: false,
                render: item => (
                    <EuiButtonIcon
                        onClick={() => this.toggleDetails(item)}
                        aria-label={this.state.itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
                        iconType={this.state.itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
                    />
                ),
            },
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
                    <EuiTitle>
                        <h2>Rules</h2>
                    </EuiTitle>
                    <br></br>
                    <EuiInMemoryTable
                        itemId="id"
                        items={items}
                        columns={columns}
                        hasActions={true}
                        search={search}
                        responsive={true}
                        tableLayout='auto'
                        isExpandable={true}
                        itemIdToExpandedRowMap={this.state.itemIdToExpandedRowMap}
                    />

                </Fragment>

            )
        }
        return (

            <h2><EuiLoadingChart size="xl" />&nbsp;&nbsp;<font size="5">Loading</font></h2>

        )


    }

}

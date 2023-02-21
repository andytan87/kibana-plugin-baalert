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

import { faker } from '@faker-js/faker';

type User = {
  id: number;
  firstName: string | null | undefined;
  lastName: string;
  github: string;
  dateOfBirth: Date;
  online: boolean;
  location: {
    city: string;
    country: string;
  };
};

const users: User[] = [];

for (let i = 0; i < 20; i++) {
users.push({
  id: i + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  github: faker.internet.userName(),
  dateOfBirth: faker.date.past(),
  online: faker.datatype.boolean(),
  location: {
    city: faker.address.city(),
    country: faker.address.country(),
  },
});
}

export class Rules extends Component {
 


  render() {
    return (
      <Fragment>
         <EuiBasicTable
      tableCaption="Demo of EuiBasicTable"
      items={users}
      rowHeader="firstName"
      columns={column}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
      </Fragment>
    );
  }
}

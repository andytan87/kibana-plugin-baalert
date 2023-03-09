import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

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
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiStat,
} from '@elastic/eui';

import { StatusUI } from "./status_ui";

import { Rules } from "./rules";

import { RulesList } from "./rules_list";

import { Tabs } from "./tabs";

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { integer } from '@elastic/elasticsearch/api/types';

interface BaalertAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const BaalertApp = ({ basename, notifications, http, navigation}: BaalertAppDeps) => {
  // Use React hooks to manage state.

  const [timestamp, setTimestamp] = useState<string | undefined>();
  // const [totalAlert, setTotalAlert] = useState<string | undefined>();


  const onClickHandler = () => {
    // Use the core http service to make a response to the server API.
    http.post('/api/baalert/successfull').then((res) => {
      setTimestamp(res.message);
      // Use the core notifications service to display a success message.
      notifications.toasts.addSuccess(
        i18n.translate('baalert.dataUpdated', {
          defaultMessage: 'Data updated',
        })
      );
    });
  };

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  const color = 'danger';
  const label = 'API Not Running';
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth={false} className="analyzeApiEUIPage NoMaxWidth">
            <EuiPageBody>
              <EuiPageHeader>
                <EuiPageHeaderSection>
                  <EuiTitle size="s">
                    <h1>
                      <EuiIcon type="logoElasticStack" size="xl" />
                      &nbsp;BA Alert&nbsp;&nbsp;
                      <EuiHealth color={color}>{label}</EuiHealth>
                    </h1>
                  </EuiTitle>
                </EuiPageHeaderSection>
              </EuiPageHeader>
              <EuiPageContent hasBorder={false}>
                <EuiPageContentHeader>
                <StatusUI httpClient={http}/>
                <EuiSpacer size="xxl" />
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  {/* <EuiButton type="primary" size="s" onClick={onClickHandler}>
                    <FormattedMessage id="baalert.buttonText" defaultMessage="Get data" />
                  </EuiButton>
                  <EuiText>
                    {timestamp || 'Unknown'}
                  </EuiText> */}
                  {/* <Tabs/> */}
                  <RulesList/>
                  {/* <Rules/> */}
                  {/* <EuiText>
                    <p>
                      <FormattedMessage
                        id="baalert.content"
                        defaultMessage="Look through the generated code and check out the plugin development documentation."
                      />
                    </p>
                    <EuiHorizontalRule />
                    <p>
                      <FormattedMessage
                        id="baalert.timestampText"
                        defaultMessage="Last timestamp: {time}"
                        values={{ time: timestamp ? timestamp : 'Unknown' }}
                      />
                    </p>
                    <EuiButton type="primary" size="s" onClick={onClickHandler}>
                      <FormattedMessage id="baalert.buttonText" defaultMessage="Get data" />
                    </EuiButton>
                  </EuiText> */}
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};

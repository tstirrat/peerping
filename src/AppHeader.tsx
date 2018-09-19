import 'material-components-web/dist/material-components-web.css';

import {
  TopAppBar,
  TopAppBarFixedAdjust,
  TopAppBarNavigationIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from '@rmwc/top-app-bar';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import pure from 'recompose/pure';

export const AppHeader = pure(() => (
  <>
    <TopAppBar fixed={true}>
      <TopAppBarRow tag="nav" role="navigation">
        <TopAppBarSection alignStart>
          <HomeIcon />
          <TopAppBarTitle tag="h1">Peer ping</TopAppBarTitle>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
    <TopAppBarFixedAdjust />
  </>
));

const neverUpdate = onlyUpdateForKeys([]);
const HomeIcon = neverUpdate(
  withRouter(({ history }) => (
    <TopAppBarNavigationIcon
      icon="home"
      // tslint:disable-next-line:jsx-no-lambda
      onClick={() => history.push('/')}
      tag="button"
      aria-label="Home"
    />
  ))
);

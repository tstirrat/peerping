import 'material-components-web/dist/material-components-web.css';

import { Theme } from '@rmwc/theme';
import {
  TopAppBar,
  TopAppBarFixedAdjust,
  TopAppBarNavigationIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from '@rmwc/top-app-bar';
import * as React from 'react';
import styled from 'react-emotion';
import { Link, withRouter } from 'react-router-dom';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import pure from 'recompose/pure';

const HomeLink = styled(Link)`
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

export const AppHeader = pure(() => (
  <>
    <TopAppBar fixed={true} theme="secondaryBg onSecondary">
      <TopAppBarRow tag="nav" role="navigation">
        <TopAppBarSection alignStart>
          <HomeIcon />
          <TopAppBarTitle tag="h1">
            {/* TODO: https://github.com/jamesmfriedman/rmwc/issues/320 */}
            <Theme use="onSecondary" wrap={(true as any) as undefined}>
              <HomeLink to="/">Peer ping</HomeLink>
            </Theme>
          </TopAppBarTitle>
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
      theme="secondaryBg onSecondary"
    />
  ))
);

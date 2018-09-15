import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AppContainer, Header, Logo, Title } from './App.styles';
import { Home } from './Home';
import logo from './logo.svg';
import { RoomRoute } from './Room';

// tslint:disable:member-access
// tslint:disable:no-console

export class App extends React.Component {
  render() {
    return (
      <Router>
        <AppContainer>
          <Header>
            <Logo src={logo} alt="logo" />
            <Title>Welcome to React</Title>
          </Header>
          <Switch>
            <Route path="/:slug" component={RoomRoute} />
            <Route path="/" component={Home} />
          </Switch>
        </AppContainer>
      </Router>
    );
  }
}

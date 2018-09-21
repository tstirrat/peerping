import { ThemeProvider } from '@rmwc/theme';
import * as firebase from 'firebase/app';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AppContainer } from './App.styles';
import { AppHeader } from './AppHeader';
import { Home } from './Home';
import { Room } from './Room';
import { Txt } from './Txt';

export interface State {
  user: firebase.User | null;
}

// tslint:disable:object-literal-sort-keys
const THEME = {
  // background: see index.css

  surface: '#37474F', // blue grey 800
  onSurface: 'rgba(255,255,255,.87)',

  primary: '#b3e5fc', // light blue 100
  // primary: '#81D4FA', // light blue 200

  onPrimary: 'rgba(0,0,0,0.87)',

  secondary: '#214b61', // blue grey, darker than 900
  onSecondary: 'rgba(255,255,255,.87)'
};

// tslint:disable:jsx-no-lambda
export class App extends React.Component {
  state: State = { user: firebase.auth().currentUser };
  private userUnsub: firebase.Unsubscribe;

  render() {
    const { user } = this.state;
    return (
      <Router>
        <ThemeProvider options={THEME}>
          <AppHeader />
          <AppContainer>
            {user ? (
              <Switch>
                <Route
                  path="/:id"
                  render={({ match }) => (
                    <Room user={user} id={match.params.id} />
                  )}
                />
                <Route
                  path="/"
                  render={props => <Home user={user} {...props} />}
                />
              </Switch>
            ) : (
              <Txt use="body2">Loading...</Txt>
            )}
          </AppContainer>
        </ThemeProvider>
      </Router>
    );
  }

  componentDidMount() {
    this.userUnsub = firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
      if (user === null) {
        firebase
          .auth()
          .signInAnonymously()
          .catch(err => console.error(err));
      }
    });
  }

  componentWillUnmount() {
    this.userUnsub();
  }
}

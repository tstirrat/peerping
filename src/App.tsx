import { Typography } from '@rmwc/typography';
import * as firebase from 'firebase/app';
import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch
} from 'react-router-dom';
import pure from 'recompose/pure';

import { AppHeader } from './AppHeader';
import { Home } from './Home';
import { RoomRoute } from './Room';

export interface State {
  user: firebase.User | null;
}

export class App extends React.Component {
  state: State = { user: firebase.auth().currentUser };
  private userUnsub: firebase.Unsubscribe;

  render() {
    const { user } = this.state;
    return (
      <Router>
        <div>
          <AppHeader />
          {user ? (
            <Switch>
              <UserRoute path="/:id" component={RoomRoute} user={user} />
              <UserRoute path="/" component={Home} user={user} />
            </Switch>
          ) : (
            <Typography use="body2" tag="p">
              Loading...
            </Typography>
          )}
        </div>
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

export interface UserRouteProps extends RouteProps {
  user: firebase.User;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const UserRoute = pure(
  ({ user, component: Component, ...rest }: UserRouteProps) => {
    const render = (props: any) => <Component {...props} user={user} />;
    return <Route {...rest} render={render} />;
  }
);

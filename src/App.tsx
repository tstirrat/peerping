import * as firebase from 'firebase/app';
import * as React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch
} from 'react-router-dom';
import pure from 'recompose/pure';

import { Header, Logo, Title } from './App.styles';
import { Home } from './Home';
import logo from './logo.svg';
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
          <Header>
            <Link to="/">
              <Logo src={logo} alt="logo" />
            </Link>
            <Title>Peer Ping</Title>
          </Header>
          {user ? (
            <Switch>
              <UserRoute path="/:id" component={RoomRoute} user={user} />
              <UserRoute path="/" component={Home} user={user} />
            </Switch>
          ) : (
            <p>Loading...</p>
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
    return (
      <Route
        {...rest}
        // tslint:disable-next-line:jsx-no-lambda
        render={props => <Component {...props} user={user} />}
      />
    );
  }
);

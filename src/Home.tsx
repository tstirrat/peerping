import Button from '@rmwc/button';
import * as firebase from 'firebase/app';
import * as greg from 'greg';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Main, Title } from './Home.styles';
import { RoomData, RoomStatus } from './Room';
import { Txt } from './Txt';

export interface Props extends RouteComponentProps {
  user: firebase.User;
}

export class Home extends React.PureComponent<Props> {
  render() {
    return (
      <Main role="main" aria-labelledby="app-title">
        <Title id="app-title" theme="primary">
          Peer ping
        </Title>
        <Txt use="subtitle1">Measure the ping between two peers</Txt>
        <Button raised onClick={this.createRoomClicked}>
          Create room
        </Button>
      </Main>
    );
  }

  private createRoomClicked = () => {
    const { user, history } = this.props;

    const room: RoomData = {
      ownerId: user.uid,
      status: RoomStatus.WAITING
    };

    const id = greg.sentence().replace(/\s/g, '-');
    firebase
      .database()
      .ref()
      .child(`rooms/${id}`)
      .set(room)
      .then(() => history.push(`/test/${id}`));
  };
}

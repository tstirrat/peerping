import Button from '@rmwc/button';
import Typography from '@rmwc/typography';
import * as firebase from 'firebase/app';
import * as greg from 'greg';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { RoomData, RoomStatus } from './Room';

export interface Props extends RouteComponentProps {
  user: firebase.User;
}

export class Home extends React.PureComponent<Props> {
  render() {
    return (
      <main role="main" aria-labelledby="app-title">
        <Typography use="headline1" tag="h1" id="app-title">
          Peer ping
        </Typography>
        <Typography use="body1" tag="p">
          Measure the latency between two peers
        </Typography>
        <Button raised type="button" onClick={this.createRoomClicked}>
          Create room
        </Button>
      </main>
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
      .then(() => history.push(`/${id}`));
  };
}

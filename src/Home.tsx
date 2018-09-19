import Button from '@rmwc/button';
import Typography from '@rmwc/typography';
import * as firebase from 'firebase/app';
import * as greg from 'greg';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { RoomData, RoomStatus } from './Room';

// import * as PropTypes from 'prop-types';
export interface Props extends RouteComponentProps {
  user: firebase.User;
}

export class Home extends React.Component<Props> {
  render() {
    return (
      <>
        <Typography use="headline1" tag="h1">
          Peer ping
        </Typography>
        <Typography use="body1" tag="p">
          Measure the latency between two peers
        </Typography>
        <form>
          <Button raised type="button" onClick={this.createRoomClicked}>
            Create room
          </Button>
        </form>
      </>
    );
  }

  private createRoomClicked = () => {
    const { user, history } = this.props;

    const room: RoomData = {
      ownerId: user.uid,
      status: RoomStatus.DISCONNECTED
    };

    const id = greg.sentence().replace(/\s/g, '-');
    firebase
      .database()
      .ref()
      .child(`rooms/${id}`)
      .set(room)
      .then(() => history.push(`/${id}`)); // TODO: use react-router
  };
}

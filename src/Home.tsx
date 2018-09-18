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
    const { user } = this.props;
    (window as any).firebase = firebase;
    return (
      <>
        <h1>Peer ping</h1>
        User: {user.uid}
        <form>
          <button type="button" onClick={this.createRoomClicked}>
            Create room
          </button>
        </form>
      </>
    );
  }

  private createRoomClicked = () => {
    // TODO: fix the potential race condition here
    if (!this.props.user) {
      throw new Error('Authed user is required');
    }

    const room: RoomData = {
      ownerId: this.props.user.uid,
      status: RoomStatus.DISCONNECTED
    };

    const id = greg.sentence().replace(/\s/g, '-');
    firebase
      .database()
      .ref()
      .child(`rooms/${id}`)
      .set(room)
      .then(() => this.props.history.push(`/${id}`)); // TODO: use react-router
  };
}

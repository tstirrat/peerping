import * as firebase from 'firebase/app';
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import * as Peer from 'simple-peer';

import { ConnectionStats, RTT_PROP } from './ConnectionStats';

export interface UrlParams {
  id: string;
}

export interface Props extends RouteComponentProps<UrlParams> {
  user: firebase.User;
}

export interface State {
  peer?: Peer.Instance;
  meta?: string;
  connection?: RTCPeerConnection;
  goHome?: boolean;
}

export enum RoomStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}

export interface RoomData {
  ownerId: string;
  signal?: {};
  status: RoomStatus;
}

export class Room extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { match, user } = this.props;
    const id = match.params.id;

    const db = firebase.database();
    let isHost = false;

    const roomRef = db.ref(`rooms/${id}`);

    roomRef
      .once('value')
      .then(snap => snap.val() as RoomData | null)
      .then(room => {
        if (room) {
          isHost = !!user && user.uid === room.ownerId;
          this.connect(
            isHost,
            peer,
            roomRef
          );
        } else {
          this.setState({ goHome: true });
        }
      });

    roomRef.on('value', snap => {
      const meta = JSON.stringify(snap && snap.val(), undefined, 2);
      this.setState({ meta });
    });

    const peer = new Peer({ initiator: isHost, trickle: false });

    peer.on('error', err => console.error(err));

    peer.on('connect', () => {
      console.log('CONNECT');
      roomRef.child('status').set(RoomStatus.CONNECTED);

      const connection: RTCPeerConnection = (peer as any)._pc;
      this.setState({ connection });

      connection.getStats().then(reports => {
        const output: RTCStats[] = [];
        reports.forEach(report => {
          if (RTT_PROP in report) {
            console.log(report.id, report.type, report[RTT_PROP]);
          }
          output.push(report);
        });
        console.table(output);
      });
    });

    peer.on('close', () => {
      console.log('DISCONNECT');
      roomRef.child('status').set(RoomStatus.DISCONNECTED);
    });

    peer.on('data', data => console.log('received: ' + data));

    this.setState({ peer });
  }

  componentWillUnmount() {
    const id = this.props.match.params.id;
    const db = firebase.database();
    const roomRef = db.ref(`rooms/${id}`);
    roomRef.off('value');
  }

  render() {
    const { meta, connection, goHome } = this.state;
    return (
      <>
        {goHome && <Redirect to="/" />}

        <h1>Room</h1>
        {connection ? <ConnectionStats connection={connection} /> : null}
        <pre>{meta}</pre>
      </>
    );
  }

  private connect(
    isHost: boolean,
    peer: Peer.Instance,
    roomRef: firebase.database.Reference
  ) {
    let me = 'signal/host';
    let them = 'signal/guest';

    if (!isHost) {
      console.log('connecting as guest ...');
      me = 'signal/guest';
      them = 'signal/host';
    }

    // push my signal data to the DB
    peer.on('signal', data => {
      console.log('SIGNAL', data);
      roomRef.child(me).set(data);
      roomRef.child('status').set('connecting');
    });

    // look for other client's signal data and send it
    roomRef.child(them).on('value', snap => {
      const signalData = snap && snap.val();
      if (signalData) {
        console.log('sending signal data', signalData.type);
        peer.signal(signalData);

        roomRef.child(them).remove();
        roomRef.child(them).off();
      }
    });
  }
}

export const RoomRoute = withRouter(Room);

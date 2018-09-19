import { Typography } from '@rmwc/typography';
import * as firebase from 'firebase/app';
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import * as Peer from 'simple-peer';

import { ConnectionStats } from './ConnectionStats';
import { CodeBlock } from './Room.styles';

export interface UrlParams {
  id: string;
}

export interface Props extends RouteComponentProps<UrlParams> {
  user: firebase.User;
}

export interface State {
  meta?: string;
  connection?: RTCPeerConnection;
  goHome?: boolean;
  stats?: any[];
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

export class Room extends React.PureComponent<Props, State> {
  state: State = {};

  componentDidMount() {
    const { match, user } = this.props;
    const id = match.params.id;

    const db = firebase.database();

    const roomRef = db.ref(`rooms/${id}`);

    roomRef
      .once('value')
      .then(snap => snap.val() as RoomData | null)
      .then(room => {
        if (room) {
          const isHost = !!user && user.uid === room.ownerId;
          const peer = this.connect(
            isHost,
            roomRef
          );
          (window as any).peer = peer;
        } else {
          this.setState({ goHome: true });
        }
      });

    roomRef.on('value', snap => {
      const meta = JSON.stringify(snap && snap.val(), undefined, 2);
      this.setState({ meta });
    });
  }

  componentWillUnmount() {
    const id = this.props.match.params.id;
    const db = firebase.database();
    const roomRef = db.ref(`rooms/${id}`);
    roomRef.off('value');
  }

  render() {
    const { meta, connection, goHome } = this.state;
    const id = this.props.match.params.id;
    const url = `${process.env.REACT_APP_PUBLIC_URL}/${id}`;
    return (
      <main role="main">
        {goHome && <Redirect to="/" />}

        <Typography use="body1" tag="p">
          Give the room link to a friend to see the ping value between your
          devices
        </Typography>

        <Typography use="body2" tag="p">
          Room link: <a href={url}>{url}</a>
        </Typography>

        {connection ? <ConnectionStats connection={connection} /> : null}

        <aside role="contentinfo">
          <Typography use="headline4" tag="h1">
            Debug
          </Typography>
          <CodeBlock use="caption" tag="pre">
            {meta}
          </CodeBlock>
        </aside>
      </main>
    );
  }

  private connect(isHost: boolean, roomRef: firebase.database.Reference) {
    const peer = new Peer({ initiator: isHost, trickle: false });

    peer.on('error', err => console.error(err));

    peer.on('connect', () => {
      console.log('CONNECT');
      if (isHost) {
        roomRef.child('status').set(RoomStatus.CONNECTED);
      }

      const connection: RTCPeerConnection = (peer as any)._pc;
      this.setState({ connection });

      this.getStats(connection).then(stats => this.printStats(stats));
    });

    peer.on('close', () => {
      console.log('DISCONNECT');
      if (isHost) {
        roomRef.child('status').set(RoomStatus.DISCONNECTED);
      }
    });

    peer.on('data', data => console.log('received: ' + data));

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
      if (isHost) {
        roomRef.child('status').set('connecting');
      }
    });

    // look for other client's signal data and send it
    roomRef.child(them).on('value', snap => {
      const signalData = snap && snap.val();
      if (signalData) {
        console.log('sending signal data', signalData.type);
        peer.signal(signalData);
        roomRef.child(them).off();
        if (isHost) {
          roomRef.child(them).remove();
        }
      }
    });

    return peer;
  }

  private getStats(connection: RTCPeerConnection) {
    return connection.getStats().then(response => {
      const reports: RTCStats[] = [];
      response.forEach(report => reports.push(report));
      return reports;
    });
  }

  private printStats(stats: RTCStats[]): any {
    const isRttKey = (k: string) =>
      k.toLowerCase().includes('rtt') || k.toLowerCase().includes('roundtrip');
    const filteredStats = stats.map(report => {
      const { id, type, timestamp, ...rest } = report;
      const out = { id, type, timestamp };

      const rttKeys = Object.keys(rest).filter(isRttKey);
      rttKeys.forEach(k => (out[k] = report[k]));
      return out;
    });
    console.table(filteredStats);
  }
}

export const RoomRoute = withRouter(Room);

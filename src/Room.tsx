import * as firebase from 'firebase';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as Peer from 'simple-peer';
import { ConnectionStats, RTT_PROP } from './ConnectionStats';

export interface Props {
  slug: string;
}

export interface State {
  peer?: Peer.Instance;
  meta?: string;
  latencyMs?: number;
  connection?: RTCPeerConnection;
}

export class Room extends React.Component<RouteComponentProps<Props>, State> {
  state: State = {};

  componentDidMount() {
    const isHost = location.hash === '#1';
    const id = this.props.match.params.slug;

    const db = firebase.database();

    const roomRef = db.ref(`rooms/${id}`);

    roomRef.on('value', snap => {
      const meta = JSON.stringify(snap && snap.val(), undefined, 2);
      this.setState({ meta });
    });

    const peer = new Peer({
      initiator: isHost,
      trickle: false
    });

    peer.on('error', err => console.log('error', err));

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

    peer.on('connect', () => {
      console.log('CONNECT');
      roomRef.child('connected').set(true);
      peer.send('whatever ' + Math.random());
      (window as any).peer = peer;

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

    peer.on('data', data => console.log('received: ' + data));

    this.setState({ peer });
  }

  componentWillUnmount() {
    const id = this.props.match.params.slug;
    const db = firebase.database();
    const roomRef = db.ref(`rooms/${id}`);
    roomRef.off('value');
  }

  render() {
    const { meta, connection } = this.state;
    return (
      <>
        <h1>Room</h1>
        {connection ? <ConnectionStats connection={connection} /> : null}
        <pre>{meta}</pre>
      </>
    );
  }
}

export const RoomRoute = withRouter(Room);

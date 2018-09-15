import * as firebase from 'firebase';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as Peer from 'simple-peer';

// tslint:disable:member-access
// tslint:disable:no-console

export interface IProps {
  slug: string;
}

export interface IState {
  peer?: Peer.Instance;
  meta?: string;
}

export class Room extends React.Component<RouteComponentProps<IProps>, IState> {
  state: IState = {};

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
      const isRtt = (key: string) => {
        const k = key.toLowerCase();
        return k.includes('round') || k.includes('rtt');
      };

      const logRttValues = (report: {}) => {
        const keys = Object.keys(report).filter(isRtt);
        keys.forEach(k => console.log(k, report[k]));
      };
      (peer as any)._pc.getStats().then((res: RTCStatsReport) => {
        res.forEach(report => logRttValues(report));
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
    const { meta } = this.state;
    return (
      <>
        <h1>Room</h1>
        <pre>{meta}</pre>
      </>
    );
  }
}

export const RoomRoute = withRouter(Room);

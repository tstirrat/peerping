import * as React from 'react';
import * as Peer from 'simple-peer';
import { AppContainer, Header, Intro, Logo, Title } from './App.styles';
import logo from './logo.svg';

// tslint:disable:member-access
// tslint:disable:no-console

export interface IState {
  incoming?: string;
  outgoing?: string;
  peer?: Peer.Instance;
}

export class App extends React.Component<{}, IState> {
  state: IState = {};

  componentDidMount() {
    const peer = new Peer({
      initiator: location.hash === '#1',
      trickle: false
    });

    peer.on('error', err => console.log('error', err));

    peer.on('signal', data => {
      console.log('SIGNAL', data);
      this.setState({ outgoing: JSON.stringify(data) });
    });

    peer.on('connect', () => {
      console.log('CONNECT');
      peer.send('whatever ' + Math.random());
    });

    peer.on('data', data => console.log('data: ' + data));

    this.setState({ peer });
  }

  render() {
    const { incoming, outgoing } = this.state;
    return (
      <AppContainer>
        <Header>
          <Logo src={logo} alt="logo" />
          <Title>Welcome to React</Title>
        </Header>
        <Intro>
          <h1>Incoming</h1>
          <form onSubmit={this.onSubmit}>
            <textarea onChange={this.onChange}>{incoming}</textarea>
            <button type="submit">Submit</button>
          </form>

          <h1>Outgoing</h1>
          <pre>{outgoing}</pre>
        </Intro>
      </AppContainer>
    );
  }

  private onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (this.state.peer && this.state.incoming) {
      const peer = this.state.peer;
      peer.signal(JSON.parse(this.state.incoming));
    }
  };

  private onChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ incoming: ev.target.value });
}

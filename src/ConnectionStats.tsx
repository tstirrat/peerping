import { Typography } from '@rmwc/typography';
import * as React from 'react';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

export interface Props {
  connection: RTCPeerConnection;
}

export interface State {
  latencyMs?: number;
}

export const RTT_PROP = 'currentRoundTripTime';
function convertRttToMs(latency?: number) {
  return latency === undefined ? NaN : Math.floor(latency * 1000);
}

function getLatency(
  connection: RTCPeerConnection
): Promise<number | undefined> {
  return connection.getStats().then(reports => {
    let latencyMs;
    reports.forEach(report => {
      if (
        // report.type === 'candidate-pair' &&
        RTT_PROP in report
      ) {
        latencyMs = convertRttToMs(report[RTT_PROP]);
      }
    });
    return latencyMs;
  });
}

export class ConnectionStats extends React.PureComponent<Props, State> {
  state: State = {};

  private destroy$ = new Subject<void>();

  componentWillMount() {
    const { connection } = this.props;

    timer(0, 2000)
      .pipe(
        switchMap(() => getLatency(connection)),
        takeUntil(this.destroy$)
      )
      .subscribe(latency => this.setState({ latencyMs: latency }));
  }

  componentWillUnmount() {
    this.destroy$.next(undefined);
  }

  render() {
    const { latencyMs } = this.state;

    return (
      <Typography use="body1" tag="p">
        Latency: <span>{latencyMs}</span>
      </Typography>
    );
  }
}

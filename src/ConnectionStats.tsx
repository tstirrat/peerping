import * as React from 'react';
import componentFromStream from 'recompose/componentFromStream';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Txt } from './Txt';

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

export const ConnectionStats = componentFromStream<Props>(props => {
  const props$ = props as Observable<Props>;
  return props$.pipe(
    switchMap(({ connection }) => {
      return timer(0, 2000).pipe(
        switchMap(() => getLatency(connection)),
        map(latencyMs => (
          <Txt>
            Ping: <span>{latencyMs}</span>
            ms
          </Txt>
        ))
      );
    })
  );
});

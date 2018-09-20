import * as React from 'react';
import componentFromStream from 'recompose/componentFromStream';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { GaugeChart } from './GaugeChart';
import { Txt } from './Txt';

export interface Props {
  connection: RTCPeerConnection;
}

export interface State {
  rtt?: number;
}

function convertRttToMs(seconds?: number) {
  return seconds === undefined ? -1 : Math.floor(seconds * 1000);
}

export const RTT_PROP = 'currentRoundTripTime';

function getRtt(connection: RTCPeerConnection): Promise<number | undefined> {
  return connection.getStats().then(reports => {
    let rtt: number | undefined;
    reports.forEach(report => {
      if (report.type === 'candidate-pair') {
        rtt = convertRttToMs(report[RTT_PROP]);
      }
    });
    return rtt;
  });
}

export const ConnectionStats = componentFromStream<Props>(props => {
  const props$ = props as Observable<Props>;
  return props$.pipe(
    switchMap(({ connection }) => {
      return timer(0, 2000).pipe(
        switchMap(() => getRtt(connection)),
        map((rtt = -1) => {
          const invertedRtt = 1000 - Math.min(rtt, 1000);
          return (
            <>
              <GaugeChart value={invertedRtt} />
              <Txt>
                Ping: <span>{rtt}</span>
                ms
              </Txt>
            </>
          );
        })
      );
    })
  );
});

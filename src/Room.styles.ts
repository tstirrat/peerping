import { Card, CardPropsT } from '@rmwc/card';
import styled from 'react-emotion';
import defaultProps from 'recompose/defaultProps';

import { Txt } from './Txt';

export const CodeBlock = styled(Txt)`
  font-family: 'Roboto Mono', monospace;
  overflow-x: scroll;
`;

export const CardContent = styled('div')`
  padding: 1rem;
`;

const CardWithProps = defaultProps<CardPropsT>({
  role: 'main',
  tag: 'main'
})(Card);

export const MainCard = styled(CardWithProps)`
  margin: 0 auto;
  max-width: 800px;
`;

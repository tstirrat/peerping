import styled from 'react-emotion';
import defaultProps from 'recompose/defaultProps';

import { Props, Txt } from './Txt';

export const Main = styled('main')`
  text-align: center;
`;

const TitleWithProps = defaultProps<Props>({
  tag: 'h1',
  theme: 'primary',
  use: 'headline2'
})(Txt);

export const Title = styled(TitleWithProps)`
  margin: 0;
`;

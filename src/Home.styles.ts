import styled from 'react-emotion';
import defaultProps from 'recompose/defaultProps';

import { Props, Txt } from './Txt';

export const Main = styled('main')`
  text-align: center;
`;

const TitleWithProps = defaultProps<Props>({
  theme: 'primary',
  use: 'headline1'
})(Txt);

export const Title = styled(TitleWithProps)`
  margin: 0;
`;

import styled from 'react-emotion';

export const AppContainer = styled('div')`
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 800px;
  padding: 24px;

  @media (max-width: 599px) {
    padding: 16px;
  }
`;

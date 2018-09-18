import styled from 'react-emotion';

export const Logo = styled('img')`
  animation: logo-spin infinite 20s linear;
  height: 80px;

  @keyframes logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Header = styled('div')`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;

export const Title = styled('div')`
  font-size: 1.5em;
`;

export const Intro = styled('div')`
  font-size: large;
`;

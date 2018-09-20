import Typography, { TypographyPropsT } from '@rmwc/typography';
import * as React from 'react';
import pure from 'recompose/pure';

const TAG_MAP: { [K in TypographyPropsT['use']]?: string } = {
  body1: 'p',
  body2: 'aside',
  caption: 'span',
  headline1: 'h1',
  headline2: 'h2',
  headline3: 'h3',
  headline4: 'h4',
  headline5: 'h5',
  headline6: 'h6',
  subtitle1: 'h4',
  subtitle2: 'h5'
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type OtherProps = Omit<TypographyPropsT, 'use'>;

export type Props = OtherProps & {
  use?: TypographyPropsT['use'];
};

export const Txt = pure<Props>(
  ({ children, use = 'body1', theme, ...rest }) => {
    return (
      <Typography
        tag={TAG_MAP[use]}
        use={use}
        {...rest}
        theme={theme || 'onSurface'}
      >
        {children}
      </Typography>
    );
  }
);

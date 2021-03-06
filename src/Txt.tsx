import Typography, { TypographyPropsT } from '@rmwc/typography';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import mapProps from 'recompose/mapProps';
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

/** Standard props but use is now optional */
export type Props = OtherProps & {
  use?: TypographyPropsT['use'];
};

const enhance = compose<TypographyPropsT, Props>(
  defaultProps({ use: 'body1', theme: 'onSurface' }),
  mapProps<Props, TypographyPropsT>(props => ({
    ...props,
    tag: props.tag ? props.tag : TAG_MAP[props.use]
  }))
);

export const Txt = enhance(pure(Typography));

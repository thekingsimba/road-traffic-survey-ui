import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  SyntheticEvent,
} from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { styles } from './Button.styles';

type CommonButtonProps = {
  intent?: VariantProps<typeof styles>['intent'];
  onClick?: (e: SyntheticEvent<HTMLButtonElement>) => void;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = CommonButtonProps &
  (
    | {
        children: ReactNode;
        text?: never;
      }
    | {
        children?: never;
        text: string;
      }
  );

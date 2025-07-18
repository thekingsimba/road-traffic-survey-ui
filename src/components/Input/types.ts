import type { IconIds } from '@components/Icon/Icon';
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export type InputProps = {
  errorMsg?: string;
  disableErrorMsg?: boolean,
  wrapperClassName?: string;
  iconId?: IconIds,
  iconClassName?: string;
  visibilityToggle?: boolean;
  visibilityButtonClassName?: string;
  visibilityIconClassName?: string
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type IconInputProps = {
  iconId: IconIds,
  iconClassName?: string;
} & InputProps

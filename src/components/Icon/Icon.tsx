import type { SVGProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type IconIds =
  | 'arrow'
  | 'completed'
  | 'question'
  | 'button-loading'
  | 'minus'
  | 'plus'
  | 'pencil'
  | 'check-mark'
  | 'more-horizontal'
  | 'link'
  | 'premmplus-logo'
  | 'cross'
  | 'cross-secondary'
  | 'user'
  | 'circle'
  | 'loader'
  | 'info'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-hide'
  | 'button-filter'
  | 'button-download'
  | 'button-reset'
  | 'button-apply'
  | 'warning'
  | 'log-out'
  | 'chevron'
  | 'newUser'
  | 'downloadResult'
  | 'client-icon'
  | 'calendar-icon'
  | 'info-icon'
  | 'upload-icon'
  | 'option-icon'
  | 'user-group-icon'

type IconProps = {
  id: IconIds;
  className?: string;
} & SVGProps<SVGSVGElement>;

export const Icon: FC<IconProps> = ({ id, className, ...rest }) => (
  <svg
    data-testid='icon-svg'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    className={twMerge('size-6', className)}
    {...rest}
  >
    <use data-testid={`icon-${id}`} href={`/sprite-sheet.svg#${id}`} />
  </svg>
);

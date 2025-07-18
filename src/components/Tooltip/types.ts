import type { ReactNode } from 'react';

export type TooltipProps = {
  children?: ReactNode;
  interactive?: boolean;
  content: ReactNode | string;
  wrapperClassName?: string;
  className?: string;
  showOnlyIfTruncated?: boolean;
};

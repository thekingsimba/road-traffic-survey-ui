import { type ReactNode } from 'react';

export type DropdownMenuOption<T extends { toString(): string }> = {
  label: string;
  value: T;
  actionId?: string;
  view?: ReactNode;
  disabled?: boolean;
  disableHideOnClick?: boolean,
};

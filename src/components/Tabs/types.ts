import type { KeyboardEvent, ReactNode } from 'react';

export type TabsProps = {
  items: TabItem[];
  onSelectTab?: (tab: TabItem) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  title?: string;
  disabled?: boolean;
  currentTab?: string;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
  buttonClassName?: string;
  scrollCurrentTabIntoViewOptions?: { behavior?: ScrollBehavior, block?: ScrollLogicalPosition, inline?: ScrollLogicalPosition }
};

export type TabItem = {
  title: string;
  buttonContent?: ReactNode;
  disabled?: boolean;
  element: ReactNode;
};

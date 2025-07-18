/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from '@components/Typography';
import type { FC } from 'react';
import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import type { TabsProps } from './types';
import React from 'react';

export const Tabs: FC<TabsProps> = ({
  items,
  onSelectTab,
  title,
  onKeyDown,
  currentTab,
  disabled,
  className,
  contentClassName,
  buttonClassName,
  textClassName,
  scrollCurrentTabIntoViewOptions,
}) => {
  const tabListId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [, startTransition] = useTransition();
  const preSelectedItem = items.findIndex(item => item.title === currentTab);
  const [openTab, setOpenTab] = useState(preSelectedItem !== -1 ? preSelectedItem : 0);

  useEffect(() => {
    setOpenTab(preSelectedItem !== -1 ? preSelectedItem : 0);
  }, [items]);

  const selectTab = (tabIndex: number) => {
    if (!disabled)
      startTransition(() => onSelectTab ? onSelectTab(items[tabIndex]) : setOpenTab(tabIndex));
  };

  useEffect(() => {
    selectTab(preSelectedItem !== -1 ? preSelectedItem : 0);
  }, [currentTab]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let flag = false;
    const links = Array.from(document.querySelectorAll(`[role="tab"][id^="tab-${tabListId}-"]`));

    switch (event.key) {
      case 'ArrowLeft':
        (links[(links.findIndex(link => link.getAttribute('data-index') === event.currentTarget.getAttribute('data-index')) - 1 + links.length) % links.length] as HTMLButtonElement).focus();
        flag = true;
        break;

      case 'ArrowRight':
        (links[(links.findIndex(link => link.getAttribute('data-index') === event.currentTarget.getAttribute('data-index')) + 1) % links.length] as HTMLButtonElement).focus();
        flag = true;
        break;

      case 'ArrowDown':
        (links[(links.findIndex(link => link.getAttribute('data-index') === event.currentTarget.getAttribute('data-index')) + 1) % links.length] as HTMLButtonElement).focus();
        flag = true;
        break;

      case 'ArrowUp':
        (links[(links.findIndex(link => link.getAttribute('data-index') === event.currentTarget.getAttribute('data-index')) - 1 + links.length) % links.length] as HTMLButtonElement).focus();
        flag = true;
        break;

      case 'Home':
        (links[0] as HTMLButtonElement).focus();
        flag = true;
        break;

      case 'End':
        (links[links.length - 1] as HTMLButtonElement).focus();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }

    onKeyDown?.(event);
  };

  useEffect(() => {
    const options = scrollCurrentTabIntoViewOptions;
    if (options && tabRefs.current[openTab])
      tabRefs.current[openTab]?.scrollIntoView({ behavior: options.behavior, block: options.block, inline: options.inline });
  }, [openTab]);

  return (
    <section data-testid={`tabs-${tabListId}`} className={twMerge('flex h-full flex-col', className)}>
      {title ? <span id={`tablist-${tabListId}`} className='sr-only'>{title}</span> : null}
      <header
        role='tablist'
        aria-labelledby={title ? `tablist-${tabListId}` : undefined}
        className='no-scrollbar flex w-full max-w-full shrink-0 overflow-auto rounded-t'
      >
        {items.map((item, index) => (
          <button
            ref={(element) => { tabRefs.current[index] = element; }}
            onKeyDown={handleKeyDown}
            id={`tab-${tabListId}-${index}`}
            type='button'
            data-testid={`tab-${item.title}`}
            role='tab'
            aria-selected={openTab === index}
            aria-controls={`tabpanel-${index}-${tabListId}`}
            tabIndex={openTab === index ? undefined : -1}
            key={index}
            disabled={disabled || item.disabled}
            data-index={index}
            className={twMerge(
              `inline-block shrink-0 cursor-pointer rounded-t px-5 focus:outline-none 
              focus-visible:bg-blue-100 disabled:cursor-not-allowed motion-safe:transition-colors 
              ${disabled ? '' : 'aria-selected:border-b-[2px]'}`,
              buttonClassName
            )}
            onClick={() => selectTab(index)}
          >
            {item.buttonContent ?? <Typography className={twMerge('py-1.5', textClassName)} text={item.title} />}
          </button>
        ))}
      </header>
      <main
        aria-labelledby={`tab-${tabListId}-${items.findIndex(item => item.title === items[openTab]?.title)}`}
        role='tabpanel'
        id='tab-content'
        className={twMerge('flex flex-col', contentClassName)}
      >
        {items[openTab]?.element}
      </main>
    </section>
  );
};

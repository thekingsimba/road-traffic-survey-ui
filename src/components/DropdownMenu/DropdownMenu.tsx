import { Icon } from '@components/Icon';
import type { OffsetOptions, Placement } from '@floating-ui/react';
import { autoUpdate, flip, offset, shift, useClick, useDismiss, useFloating, useInteractions, useListNavigation, useRole } from '@floating-ui/react';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { OptionsPortal } from './parts/OptionPortal';
import type { DropdownMenuOption } from './types';
import type { MouseEvent, KeyboardEvent, ReactElement } from 'react';

type DropdownMenuProps<T extends { toString(): string }> = {
  options: DropdownMenuOption<T>[];
  handleClick: (e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>, item: DropdownMenuOption<T>) => void | Promise<void>;
  placement?: Placement;
  offsetOptions?: OffsetOptions;
  shiftOptions?: Parameters<typeof shift>[0];
  flipOptions?: Parameters<typeof flip>[0];
  view?: ReactElement;
  disabled?: boolean;
  returnFocus?: boolean;
  classNames?: {
    trigger?: string;
    portalWrapper?: string;
    optionWrapper?: string;
    optionLabel?: string;
  };
};

export const DropdownMenu = <T extends { toString(): string }>({
  options,
  handleClick,
  placement = 'bottom-end',
  flipOptions = {
    padding: 8,
  },
  shiftOptions = {
    padding: 8,
  },
  offsetOptions = {
    mainAxis: 8,
  },
  classNames,
  disabled = false,
  returnFocus = false,
  view = <Icon id='more-horizontal' className='h-1 w-5' />,
}: DropdownMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = async (
    e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>,
    item: DropdownMenuOption<T>) => {
      if (!item.disableHideOnClick) {
        setIsOpen(false);
      }

        await handleClick(e, item);
  };

  const floating = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(shiftOptions),
      flip(flipOptions),
      offset(offsetOptions),
    ],
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);

  const click = useClick(floating.context);
  const role = useRole(floating.context, { role: 'menu' });
  const dismiss = useDismiss(floating.context, {
    ancestorScroll: true,
  });

  const listNavigation = useListNavigation(floating.context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    openOnArrowKeyDown: true,
    scrollItemIntoView: false,
  });

  const interactions = useInteractions([listNavigation, click, dismiss, role]);

  return (
    <>
      <button
        disabled={disabled}
        data-open={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className={twMerge('outline-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center', classNames?.trigger)}
        ref={floating.refs.setReference}
        {...interactions.getReferenceProps()}
        type='button'
      >
        {view}
      </button>
      <OptionsPortal
        isOpen={isOpen}
        currentOptions={options}
        handleOptionClick={handleOptionClick}
        floating={floating}
        interactions={interactions}
        listRef={listRef}
        classNames={{
          wrapper: classNames?.portalWrapper,
          optionWrapper: classNames?.optionWrapper,
          optionLabel: classNames?.optionLabel,
        }}
        returnFocus={returnFocus}
      />
    </>
  );
};

import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import type { HTMLProps, KeyboardEventHandler, MouseEventHandler, RefObject, MouseEvent, KeyboardEvent } from 'react';
import { twMerge } from 'tailwind-merge';

type WithListRef = {
  index: number;
  listRef?: RefObject<(HTMLElement | null)[]>;
} | {
  index?: never;
  listRef?: never;
};

type OptionElementProps<T extends { toString(): string }> = {
  option: DropdownMenuOption<T>;
  handleOptionClick: (e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>, item: DropdownMenuOption<T>) => void | Promise<void>;
  getItemProps?: (userProps?: Omit<HTMLProps<HTMLElement>, 'selected' | 'active'>) => Record<string, unknown>;
  classNames?: {
    wrapper?: string;
    label?: string;
  };
} & WithListRef;

export function OptionElement<T extends { toString(): string }>({
  index,
  option,
  handleOptionClick,
  listRef,
  getItemProps,
  classNames,
}: OptionElementProps<T>) {
  const handleClick: MouseEventHandler<HTMLLIElement> = async (e: MouseEvent<HTMLLIElement>) => {
    if (!option.disabled)
      await handleOptionClick(e, option);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLLIElement> = async (e: KeyboardEvent<HTMLLIElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !option.disabled)
      await handleOptionClick(e, option);
  };

  return (
    <li
      role='menuitem'
      tabIndex={0}
      ref={listRef
      ? (node) => {
          listRef.current[index] = node;
        }
      : undefined}
      {...getItemProps?.()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={twMerge(`cursor-pointer h-7 truncate bg-transparent px-5 py-[2px] hover:bg-[#F4F4F6] motion-safe:transition-color focus:bg-[#F4F4F6] flex flex-row items-center outline-none ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`, classNames?.wrapper)}
    >
      {option.view
      ?? <span className={twMerge('truncate first-letter:capitalize text-sm', classNames?.label)}>
        {option.label}
      </span>
    }
    </li>
  );
};

import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import type { useFloating, useInteractions } from '@floating-ui/react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import type { RefObject, MouseEvent, KeyboardEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { OptionElement } from '../OptionElement';

type OptionsPortalProps<T extends { toString(): string }> = {
  isOpen: boolean;
  currentOptions: DropdownMenuOption<T>[];
  handleOptionClick: (e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>, item: DropdownMenuOption<T>) => void | Promise<void>;
  floating: ReturnType<typeof useFloating>;
  interactions: ReturnType<typeof useInteractions>;
  listRef: RefObject<(HTMLElement | null)[]>;
  classNames?: {
    wrapper?: string;
    optionWrapper?: string;
    optionLabel?: string;
  };
  returnFocus?: boolean;
};

export const OptionsPortal = <T extends { toString(): string }>({
  isOpen,
  currentOptions,
  handleOptionClick,
  floating: {
    refs,
    context,
    floatingStyles,
  },
  interactions: {
    getFloatingProps,
    getItemProps,
  },
  listRef,
  classNames,
  returnFocus,
}: OptionsPortalProps<T>) => {
  return (
    <FloatingPortal>
      {isOpen
        ? (
          <FloatingFocusManager context={context} initialFocus={-1} returnFocus={returnFocus}>
            <ul
              role='menu'
              className={twMerge('max-h-72 overflow-y-auto py-2 bg-white rounded-[4px] outline-none shadow-lg z-[99999]', classNames?.wrapper)}
              style={floatingStyles}
              ref={refs.setFloating}
              {...getFloatingProps()}
            >
              {currentOptions.map((option, index) => (
                <OptionElement
                  index={index}
                  key={`${option.value.toString()}-${option.actionId}`}
                  option={option}
                  handleOptionClick={handleOptionClick}
                  listRef={listRef}
                  getItemProps={getItemProps}
                  classNames={{
                    wrapper: classNames?.optionWrapper,
                    label: classNames?.optionLabel,
                  }}
                />
              ))}
            </ul>
          </FloatingFocusManager>
          )
        : null
    }
    </FloatingPortal>
  );
};

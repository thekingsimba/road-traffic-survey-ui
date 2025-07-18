/* eslint-disable react-hooks/exhaustive-deps */
import { FloatingArrow, FloatingPortal, arrow, autoUpdate, flip, offset, safePolygon, shift, useClick, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from '@floating-ui/react';
import { type FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import type { TooltipProps } from './types';

const ARROW_HEIGHT = 7;
const GAP = 2;

export const Tooltip: FC<TooltipProps> = ({
  content,
  wrapperClassName,
  className,
  children,
  interactive,
  showOnlyIfTruncated = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + GAP),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  useEffect(() => {
    if (!showOnlyIfTruncated) return;
    const containerElement = refs.reference.current as HTMLElement;

    const checkTextTruncation = () => {
      setIsTextTruncated(() => {
        return containerElement.clientWidth < containerElement.scrollWidth;
      });
    };

    // Check truncation on mount and window resize
    checkTextTruncation();
    window.addEventListener('resize', checkTextTruncation);

    return () => {
      window.removeEventListener('resize', checkTextTruncation);
    };
  }, [children]);

  // Event listeners to change the open state
  const hover = useHover(context, { move: false,
    handleClose: interactive
      ? safePolygon({
        requireIntent: true,
      })
      : undefined,
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context, {
    ancestorScroll: true,

  });
  const click = useClick(context, {
    keyboardHandlers: true
  });

  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    dismiss,
    role,
  ]);

  const { t } = useTranslation();

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={twMerge('w-fit', wrapperClassName)}
      >
        {children}
      </div>
      <FloatingPortal>
        {isOpen && content && (!showOnlyIfTruncated || isTextTruncated)
          ? <div
            className={twMerge('w-max max-w-xs text-xs rounded-xl px-4 py-2.5 break-words drop-shadow-md z-[999999] border-t-0 border-r-1 border-b-1 border-l-1 border-solid border-[#F4F4F6] bg-white first-letter:capitalize', className)}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            >
            {typeof content === 'string' ? t(content) : content}
            <FloatingArrow ref={arrowRef} context={context} height={ARROW_HEIGHT} fill='rgb(250,250,250)' />
          </div>
          : null}
      </FloatingPortal>
    </>
  );
};

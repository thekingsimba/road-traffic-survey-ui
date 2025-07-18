import { createPortal } from 'react-dom';
import { useEffect, useRef, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { twMerge } from 'tailwind-merge';
import { FocusTrap } from 'focus-trap-react';
import { useTranslation } from 'react-i18next';

type BaseModalProps = {
  id?: string;
  isOpen: boolean;
  header: ReactNode;
  onCloseHandler: VoidFunction;
  className?: string;
  disableScrolling?: boolean;
  closeDisabled?: boolean;
  renderTo?: string;
};

export const BaseModal: FC<PropsWithChildren<BaseModalProps>> = ({
  id,
  isOpen,
  children,
  header,
  onCloseHandler,
  className,
  disableScrolling = true,
  closeDisabled,
  renderTo = 'global-modals-container',
}) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (disableScrolling) {
      if (isOpen)
        document.body.classList.add('overflow-hidden');
      else
        document.body.classList.remove('overflow-hidden');
    }

    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen, disableScrolling]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !closeDisabled)
        onCloseHandler();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDisabled, onCloseHandler]);


  useEffect(() => {

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isOpen]);



  const layout = (
    <FocusTrap active={isOpen}>
      <div
        id={id}
        className={`fixed inset-0 bg-black/50 outline-0 ${isOpen ? 'z-50 flex items-center justify-center' : 'hidden'}`}
      >
        <div className='pointer-events-none relative'>
          <div
            className={twMerge('pointer-events-auto relative flex h-fit w-auto flex-col rounded-[28px] border-[#F4F4F6] bg-white outline-0', className)}
          >
            <div
              className='flex w-full items-center justify-between border-b p-6 pr-5'
            >
              {header}
              <button
                disabled={closeDisabled}
                className={`${closeDisabled && 'bg-[#EBECF0]'} button-shadow absolute right-3 top-3 cursor-pointer rounded-full border p-[9px] disabled:pointer-events-none`}
                onClick={onCloseHandler}
                aria-label={t('close')}
              >
                <Icon id='cross' className={`size-3 ${closeDisabled ? 'text-[#C3C6CC]' : 'text-secondary'}`} aria-hidden='true' />
              </button>
            </div>
            <div className='no-scrollbar relative flex-auto overflow-scroll' ref={containerRef}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );

  const container = document.getElementById(renderTo);
  return container ? createPortal(layout, container) : layout;
};

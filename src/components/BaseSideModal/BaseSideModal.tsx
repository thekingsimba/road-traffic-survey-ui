import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';
import { FocusTrap } from 'focus-trap-react';
import { useEffect, type FC, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type BaseSideModalProps = {
  isOpen: boolean;
  headerText: string;
  onCloseHandler: VoidFunction;
  className?: string;
  headerClassName?: string;
  disableScrolling?: boolean;
  renderTo?: string;
};

export const BaseSideModal: FC<PropsWithChildren<BaseSideModalProps>> = ({
  isOpen,
  children,
  onCloseHandler,
  headerText,
  className,
  headerClassName,
  disableScrolling,
  renderTo = 'global-modals-container',
 }) => {
  const { t } = useTranslation();

  useEffect(() => {

    if (disableScrolling) {
      if (isOpen)
        document.body.classList.add('overflow-hidden');
      else
        document.body.classList.remove('overflow-hidden');
    }

    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen, disableScrolling]);

  const layout = (
    <FocusTrap active={isOpen}>
      <div
        className={`fixed inset-0 bg-black/50 outline-0 ${isOpen ? 'z-50 flex items-end justify-end' : 'hidden'}`}
      >
        <div className='max-w-screen pointer-events-none relative h-full'>
          <div
            className={twMerge('pointer-events-auto relative flex h-full w-auto flex-col bg-white', className)}
          >
            <div
              className={twMerge('flex w-full items-center justify-between min-h-16 pl-6 pr-7 border-b border-[#F4F4F6]', headerClassName)}
            >
              <Typography text={t(headerText)} className='text-[22px]' tag='h1' weight='bold' />
              <button
                className='disabled:pointer-events-none'
                onClick={onCloseHandler}
                aria-label={t('close')}
              >
                <Icon id='cross-secondary' className='size-5 text-secondary' aria-hidden='true' />
              </button>
            </div>
            <div className='flex flex-1 flex-col overflow-hidden'>
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

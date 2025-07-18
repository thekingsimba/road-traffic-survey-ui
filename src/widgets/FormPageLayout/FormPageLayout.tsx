import { Typography } from '@components/Typography';
import type { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type FormPageLayoutProps = {
  headerText: string;
  headerClassName?: string;
  className?: string;
  wrapperClassName?: string;
}

export const FormPageLayout: FC<PropsWithChildren<FormPageLayoutProps>> = ({ children, wrapperClassName, className, headerText, headerClassName }) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge('page-without-header fixed inset-0 outline-0 flex items-center justify-center bg-[#F4F4F6]', wrapperClassName)}
    >
      <div className='pointer-events-none relative'>
        <div
          className={twMerge('pointer-events-auto relative flex h-fit w-auto flex-col rounded-[28px] bg-white outline-0', className)}
        >
          <div
            className={twMerge('flex w-full items-center justify-center border-b border-[#F4F4F6] p-6', headerClassName)}
          >
            <Typography tag='h1' text={t(headerText)} className='text-[26px] first-letter:capitalize' weight='bold' />
          </div>
          <div className='relative flex-auto'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

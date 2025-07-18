import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/Button/Button';
import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';

export const FilterFooter: FC<{ onReset: () => void; onApply: () => void }> = ({ onReset, onApply }) => {
  const { t } = useTranslation();

  return (
    <div className='sticky bottom-0 flex min-h-[72px] items-center justify-center space-x-6 bg-[#FFFFFFA3] px-6 py-4 backdrop-blur-[96px]'>
      <Button
        intent='secondary'
        onClick={onReset}
        className='h-10 w-full items-center justify-center space-x-2 text-[13px]'
      >
        <Typography text={t('reset')} className='text-inherit' weight='bold' />
        <Icon id='button-reset' className='ml-2 size-3' aria-hidden='true' />
      </Button>
      <Button
        onClick={onApply}
        className='h-10 w-full items-center justify-center space-x-2 px-3 text-[13px]'
      >
        <Typography text={t('applyFilters')} className='text-inherit' weight='bold' />
        <Icon id='button-apply' className='ml-2 size-3' />
      </Button>
    </div>
  );
};

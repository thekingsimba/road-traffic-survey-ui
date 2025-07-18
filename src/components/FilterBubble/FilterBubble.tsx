import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type BubbleProps = {
  text: string;
  onClose: VoidFunction;
  className?: string
}

export const FilterBubble: FC<BubbleProps> = ({ text, onClose, className }) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge('relative cursor-default flex h-[42px] w-fit flex-row mr-2 items-center space-x-2 mb-2 rounded-xl bg-[#00629B1A] px-3 py-[6px] text-[13px] text-primary-high button-shadow outline-[3px] outline-[#00629B3D]', className)}
    >
      <Typography text={text} className='w-fit max-w-[400px] truncate text-inherit' weight='bold' />
      <button aria-label={t('close')} onClick={onClose}>
        <Icon id='cross' className='size-3' aria-hidden='true' />
      </button>
    </div>
  );
};

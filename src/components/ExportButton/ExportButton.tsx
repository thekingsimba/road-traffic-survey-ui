import { BaseModal } from '@components/BaseModal';
import { Button } from '@components/Button';
import { Typography } from '@components/Typography';
import { Icon } from '@components/Icon';
import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'ts-luxon';

type ExportButtonProps = {
  disabled?: boolean;
  onExport: (modalId: string) => Promise<string | void>;
  onComplete?: () => Promise<void>;
};

export const ExportButton: FC<ExportButtonProps> = ({ disabled, onExport, onComplete }) => {
  const MODAL_ID = 'export-modal';
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await onExport(MODAL_ID);
      if (onComplete) await onComplete();
    } finally {
      setIsDownloading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className='h-10 space-x-2 px-3 text-[13px]'
        disabled={disabled || isDownloading}
      >
        <Typography text={t('export')} weight='bold' className='text-inherit' />
        <Icon id='button-download' className='mb-[2px] size-[18px]' aria-hidden='true' />
      </Button>

      <BaseModal
        id={MODAL_ID}
        isOpen={isModalOpen}
        onCloseHandler={handleExport}
        header={<Typography text={t('exportNotice')} weight='bold' className='text-[22px] capitalize' />}
        className='w-[324px]'
      >
        <div className='flex flex-col p-6'>
          <Typography
            text={t('utcExportWarning')}
            className='mb-4 text-[15px] text-secondary'
          />
          <Typography
            text={`${t('currentUtcTime')}: ${DateTime.utc().toFormat('HH:mm')}`}
            className='text-[15px] text-secondary'
          />
        </div>
        <div className='flex justify-center border-t px-6 pb-6 pt-4'>
          <Button
            type='button'
            intent='secondary'
            onClick={handleExport}
            className='h-12 w-full justify-center text-[15px] font-bold capitalize'
            disabled={isDownloading}
          >
            {isDownloading ? <Icon id='button-loading' className='animate-spin' /> : t('ok')}
          </Button>
        </div>
      </BaseModal>
    </>
  );
};

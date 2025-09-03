import { useState } from 'react';
import { Button } from '@components/Button/Button';
import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';
import { useTranslation } from 'react-i18next';
import { CreateSurveyModal } from './CreateSurveyModal';

type CreateSurveyButtonProps = {
  onComplete: () => void;
};

export const CreateSurveyButton = ({ onComplete }: CreateSurveyButtonProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleComplete = () => {
    setIsModalOpen(false);
    onComplete();
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className='h-10 space-x-2 px-3 text-[13px]'
      >
        <Typography text={t('createSurvey')} weight='bold' className='text-inherit' />
        <Icon id='plus' className='mb-[2px] size-[18px]' aria-hidden='true' />
      </Button>

      <CreateSurveyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
      />
    </>
  );
};

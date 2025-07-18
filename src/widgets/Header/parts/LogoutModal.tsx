import { BaseModal } from '@components/BaseModal';
import { Button } from '@components/Button';
import { Typography } from '@components/Typography';
import { useUserStore } from '@shared/stores/userStore';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal: FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const logout = useUserStore(state => state.logout);

  const handleLogoutConfirm = () => {
    navigate('/login');
    logout();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      className='w-[324px]'
      onCloseHandler={onClose}
      header={<Typography text={t('logOut', { punctuation: '?' })} weight='bold' className='text-[22px] capitalize' />}
      renderTo='root'
    >
      <div className='flex flex-col'>
        <Typography
          text={t('areYouSureWantToLogout')}
          className='p-6 text-[15px] text-secondary first-letter:capitalize'
        />

        <div className='flex w-full justify-between space-x-4 border-t px-6 pb-6 pt-4'>
          <Button
            type='button'
            intent='secondary'
            text={t('cancel')}
            onClick={onClose}
            className='h-12 w-full justify-center text-[15px]'
          />
          <Button
            type='button'
            text={t('logOut', { punctuation: '' })}
            intent='primary'
            onClick={handleLogoutConfirm}
            className='h-12 w-full justify-center text-[15px]'
          />
        </div>
      </div>
    </BaseModal>
  );
};

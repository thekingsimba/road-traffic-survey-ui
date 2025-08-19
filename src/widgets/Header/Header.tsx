import type { DropdownMenuOption } from '@components/DropdownMenu';
import { DropdownMenu } from '@components/DropdownMenu';
import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';
import { useUserStore } from '@shared/stores/userStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LogoutModal } from './parts/LogoutModal';
import { CURRENT_USER_MENU_OPTIONS } from './constants';
import { WithAuthorization } from '@widgets/WithAuthorization';
import { useLocation } from 'wouter';
import { NavigationPanel } from './parts/NavigationPanel';

export const Header = () => {
  const { t } = useTranslation();
  const user = useUserStore(state => state.user);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleuserMenuOptionClick = (option: DropdownMenuOption<string>) => {

    switch (option.value) {
      case 'changePassword':
        navigate('/change-password');
        break;
      case 'logOut':
        setIsLogoutModalOpen(true);
        break;
    }
  };

  return (
    <header className='fixed z-[19] mb-2 bg-[#FFFFFFA3] pt-2 backdrop-blur-[96px]'>
      <WithAuthorization>
        <div className='hidden text-center text-[18px] font-[700] leading-[24px] text-secondary-low md:block'> {t('DFCIadminPanel')}</div>
      </WithAuthorization>

      <div className='relative flex h-16 w-screen items-center justify-between px-4'>

        <img src='/images/logo-placeholder.jpg' alt='logo' className='ml-4 h-7 w-[115px]' />

        <div className='pointer-events-none absolute inset-0 hidden items-center justify-center md:flex'>
          <div className='pointer-events-auto'>
            <NavigationPanel />
          </div>
        </div>

        <WithAuthorization>
          <DropdownMenu
            placement='bottom'
            view={
              <>
                <Icon id='user' className='size-4 text-secondary-low' aria-hidden='true' />
                <span
                  className='inline-block max-w-[180px] overflow-hidden truncate whitespace-nowrap align-middle text-[15px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[300px]'
                  title={user?.full_name || ''}
                >
                  {user?.full_name || ''}
                </span>
              </>}
            handleClick={(_, option) => handleuserMenuOptionClick(option)}
            classNames={{
              trigger: 'space-x-2 bg-[#F9F9FA] min-h-9 px-2 rounded-3xl mr-6 shadow-[inset_0px_-1px_3px_-1px_#00000012]',
              portalWrapper: 'rounded-xl border-[#EBECF0] p-2',
              optionWrapper: 'px-4 min-h-10 rounded-md'
            }}
            options={CURRENT_USER_MENU_OPTIONS.map(item => ({
              ...item,
              view: (
                <div className='group flex min-h-10 w-full items-center justify-start space-x-2'>
                  <Icon id={item.iconId} className={twMerge('group-hover:text-primary text-secondary', item.iconClassName)} aria-hidden='true' />
                  <Typography text={t(item.label)} className='text-[13px] capitalize text-secondary group-hover:text-primary' />
                </div>)
            }))}
          />
        </WithAuthorization>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
        />
      </div>
    </header>
  );
};

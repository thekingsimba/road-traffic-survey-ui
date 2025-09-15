import { Typography } from '@components/Typography';
import { t } from 'i18next';
import { Link, useLocation } from 'wouter';
import { WithAuthorization } from '@widgets/WithAuthorization';
import { UserTypeGuard } from '@shared/components/UserTypeGuard';
import { twMerge } from 'tailwind-merge';

function getTriggerClass(path: string, currentPath: string) {
  const isActive = path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  return twMerge(
    'flex h-10 items-center px-3 sm:px-4 rounded-3xl text-[13px] font-bold whitespace-nowrap truncate first-letter:capitalize hover:bg-[#f2f2f3] hover:text-regular hover:shadow-[inset_0px_-1px_3px_-1px_#00000012] a11y:text-black',
    isActive ? 'bg-[#f2f2f3] text-regular' : 'text-secondary-low'
  );
}

export const NavigationPanel = () => {
  const [location] = useLocation();

  return (
    <WithAuthorization>
      <div className='flex max-w-full flex-wrap items-center justify-center gap-x-[6px] overflow-hidden'>
        <Link to='/' className={getTriggerClass('/', location)}>
          <Typography
            text={t('home')}
            className='truncate text-inherit first-letter:capitalize'
            weight='bold'
          />
        </Link>

        <UserTypeGuard allowedTypes={['admin']}>
          <Link to='/users' className={getTriggerClass('/users', location)}>
            <Typography
              text={t('users')}
              className='truncate text-inherit first-letter:capitalize'
              weight='bold'
            />
          </Link>
        </UserTypeGuard>

        <Link to='/surveys' className={getTriggerClass('/surveys', location)}>
          <Typography
            text={t('surveys')}
            className='truncate text-inherit first-letter:capitalize'
            weight='bold'
          />
        </Link>
      </div>
    </WithAuthorization>
  );
};

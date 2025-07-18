import type { IconIds } from '@components/Icon/Icon';
import { t } from 'i18next';

export const CURRENT_USER_MENU_OPTIONS: {
    label: string;
    value: string;
    iconId: IconIds;
    iconClassName?: string;
  }[] = [
    {
      label: t('changePassword'),
      value: 'changePassword',
      iconId: 'lock',
      iconClassName: 'size-5',
    },
    {
      label: t('logOut', { punctuation: '' }),
      value: 'logOut',
      iconId: 'log-out',
      iconClassName: 'size-5',
    },
  ];

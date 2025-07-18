import { t } from 'i18next';

export const getFilterTypeText = (filterType: string) => {
  const translated = t(filterType);

  return translated;
};

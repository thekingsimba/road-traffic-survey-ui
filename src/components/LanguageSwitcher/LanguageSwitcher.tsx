import { useTranslation } from 'react-i18next';
import { DropdownMenu } from '@components/DropdownMenu';
import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import { Typography } from '@components/Typography';
import { Icon } from '@components/Icon';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'fr', name: 'french', flag: '🇫🇷' },
  { code: 'en', name: 'english', flag: '🇺🇸' },
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const languageOptions: DropdownMenuOption<string>[] = languages.map(lang => ({
    label: `${lang.flag} ${t(lang.name)}`,
    value: lang.code,
    actionId: `lang-${lang.code}`,
  }));

  const handleLanguageChange = async (option: DropdownMenuOption<string>) => {
    await i18n.changeLanguage(option.value);
  };

  return (
    <DropdownMenu
      options={languageOptions}
      handleClick={(_, option) => handleLanguageChange(option)}
      view={
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentLanguage.flag}</span>
          <Typography 
            text={t(currentLanguage.name)} 
            className="text-sm font-medium text-secondary"
          />
          <Icon id="chevron" className="size-3 text-secondary" />
        </div>
      }
      classNames={{
        trigger: 'px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors',
        portalWrapper: 'min-w-[150px]',
      }}
    />
  );
};

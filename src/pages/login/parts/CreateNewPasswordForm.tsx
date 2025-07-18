import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import { Input } from '@components/Input';
import { Typography } from '@components/Typography';
import { FormPageLayout } from '@widgets/FormPageLayout';
import { useEffect, useState, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { MAX_PASSWORD_LENGTH } from './constants';

export type CreateNewPasswordFormData = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

type CreateNewPasswordProps = {
  onSubmit: (data: CreateNewPasswordFormData) => Promise<void>
  withCurrentPassword?: boolean;
}

const RULES: {
  key: string,
  isMatch: (value: string) => boolean;
}[] = [
  {
    key: 'beAtLeast8Characters',
    isMatch: (value) => value.trim().length >= 8,
  },
  {
    key: 'includeUpperCaseAndLowerCase',
    isMatch: (value) => /^(?=.*[a-z])(?=.*[A-Z]).+$/.test(value)
  },
  {
    key: 'containsNumber',
    isMatch: (value) => /\d/.test(value)
  },
  {
    key: 'containsSpecialCharacter',
    isMatch: (value) => /[^A-Za-z0-9]/.test(value)
  }
];

const AVOID_TO_USE_RULE_KEYS = [
  'commonWordsOrEasyToGuess',
  'yourEmailOrPersonalDetails',
  'repeatingOrSequentialCharacters'
];

export const CreateNewPasswordForm: FC<CreateNewPasswordProps> = ({ onSubmit, withCurrentPassword }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors, isValid }, trigger } = useFormContext<CreateNewPasswordFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordWatch, newPasswordConfirmWatch] = watch(['newPassword', 'newPasswordConfirm']);
  const headerText = withCurrentPassword ? t('changePassword') : t('createNewPassword');

  const handleFormSubmit = async (formData: CreateNewPasswordFormData) => {
    if (isLoading)
      return;

    try {
      setIsLoading(true);
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (newPasswordWatch && newPasswordConfirmWatch)
      trigger('newPasswordConfirm');
  }, [newPasswordWatch, newPasswordConfirmWatch, trigger]);

  return (
    <FormPageLayout
      className='w-[455px]'
      headerClassName='capitalize'
      headerText={headerText}
    >
      <form className='flex size-full flex-col p-6' onSubmit={handleSubmit(handleFormSubmit)}>
        <div className='flex w-full flex-col space-y-4'>

          {withCurrentPassword ?
            <div>
              <Input
                visibilityToggle
                placeholder={t('enterCurrentPassword')}
                iconId='lock'
                iconClassName='size-5 top-3 left-4'
                className='h-12 w-full text-[15px]'
                {...register('currentPassword', {
                          required: { value: true, message: '' },
                          maxLength: { value: MAX_PASSWORD_LENGTH, message: t('maxLengthIs', { value: MAX_PASSWORD_LENGTH }) },
                        })}
                errorMsg={errors.currentPassword?.message}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                maxLength={MAX_PASSWORD_LENGTH + 1}
              />
              <div className='flex items-center space-x-1 text-[13px] text-secondary'>
                <Icon id='info' className='size-[14px]' aria-hidden='true' />
                <Typography text={t('ifYouDontRememberPassword')} className='text-[13px] text-inherit first-letter:capitalize' />
                <Link to='reset-password' className='text-inherit underline'>{t('resetYourPassword')}</Link>
              </div>
            </div>
           : null}

          <Input
            visibilityToggle
            placeholder={t('enterYourNewPassword')}
            iconId='lock'
            iconClassName='size-5 top-3 left-4'
            className='h-12 w-full text-[15px]'
            {...register('newPassword', {
                          required: { value: true, message: '' },
                          maxLength: { value: MAX_PASSWORD_LENGTH, message: t('maxLengthIs', { value: MAX_PASSWORD_LENGTH }) },
                          validate: {
                            hasNoWhitespace: value => !/\s/.test(value) || t('containsSpaces'),
                            rulesMatch: value => (value !== undefined && RULES.every(rule => rule.isMatch(value))) || ''
                          }
                        })}
            errorMsg={errors.newPassword?.message}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            maxLength={MAX_PASSWORD_LENGTH + 1}
          />

          <Input
            visibilityToggle
            placeholder={t('confirmYourNewPassword')}
            iconId='lock'
            iconClassName='size-5 top-3 left-4'
            className='h-12 w-full text-[15px]'
            wrapperClassName='mt-4'
            {...register('newPasswordConfirm', {
                          required: { value: true, message: '' },
                          validate:
                          {
                            hasNoWhitespace: value => !/\s/.test(value) || t('containsSpaces'),
                            rulesMatch: value => value === newPasswordWatch || t('passwordsDoNotMatch')
                          }
                        })}
            errorMsg={errors.newPasswordConfirm?.message}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            maxLength={MAX_PASSWORD_LENGTH + 1}
          />
        </div>

        <div className='mt-3 space-y-1'>
          <Typography
            text={t('yourPasswordMust', { punctuation: ':' })}
            weight='bold'
            className='text-[13px] text-secondary first-letter:capitalize'
          />

          <ul aria-label={t('yourPasswordMust', { punctuation: '' })}>
            {RULES.map(rule => (
              <li key={`${rule.key}-key`} className='space-x-1 text-[13px]'>
                <span className='text-[14px] text-secondary'>&#10004; </span>
                <span className={`${newPasswordWatch && rule.isMatch(newPasswordWatch) ? 'text-[#35C220]' : 'text-secondary'}`}>
                  <Trans i18nKey={rule.key} components={{ bold: <strong /> }} />
                </span>
              </li>
          ))}
          </ul>
        </div>

        <div className='mt-3 space-y-1'>
          <Typography
            text={t('avoidUsing', { punctuation: ':' })}
            weight='bold'
            className='text-[13px] text-secondary first-letter:capitalize'
          />

          <ul aria-label={t('avoidUsing', { punctuation: '' })}>
            {AVOID_TO_USE_RULE_KEYS.map(key => (
              <li key={`${key}-key`} className='text-[13px] text-secondary'>
                <span>&#10060; {t(key)}</span>
              </li>
          ))}
          </ul>
        </div>

        <Button
          type='submit'
          className='mt-6 h-12 w-full justify-center text-center text-[15px]'
          disabled={!isValid || (newPasswordWatch !== undefined && RULES.some(rule => !rule.isMatch(newPasswordWatch)))}
        >
          {isLoading ? <Icon id='button-loading' className='size-6 animate-spin' /> : headerText}
        </Button>
      </form>
    </FormPageLayout>
  );
};

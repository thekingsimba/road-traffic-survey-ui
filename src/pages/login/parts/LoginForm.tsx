import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import { Input } from '@components/Input';
import type { SignInRequest } from '@shared/api/typesExtracted';
import { FormPageLayout } from '@widgets/FormPageLayout';
import { useState, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { MAX_PASSWORD_LENGTH } from './constants';

type LoginFormProps = {
  onSubmit: (request: SignInRequest) => Promise<void>
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isValid } } = useFormContext<SignInRequest>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: SignInRequest) => {
    if (isLoading)
      return;

    try {
      setIsLoading(true);
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormPageLayout
      className='w-[384px]'
      headerText={t('logInToYourAccount')}
    >
      <form className='flex size-full flex-col p-6' onSubmit={handleSubmit(handleFormSubmit)}>

        <div className='flex w-full flex-col space-y-4'>
          <Input
            placeholder={t('enterYourEmail')}
            iconId='mail'
            iconClassName='size-5 top-[13px] left-4'
            className='h-12 w-full text-[15px]'
            {...register('userName', {
            required: { value: true, message: '' },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: t('invalidEmail'),
            },
          })}
            maxLength={MAX_PASSWORD_LENGTH}
            errorMsg={errors.userName?.message}
          />
          <Input
            visibilityToggle
            placeholder={t('enterYourPassword')}
            iconId='lock'
            iconClassName='size-5 top-3 left-4'
            className='h-12 w-full text-[15px]'
            {...register('password', {
            required: { value: true, message: '' },
          })}
            errorMsg={errors.password?.message}
            maxLength={MAX_PASSWORD_LENGTH}
          />
        </div>

        <div className='flex w-full justify-end'>
          <Link to='/reset-password' className='mt-[6px] text-[13px] capitalize text-primary hover:underline'>
            {t('forgotPassword')}
          </Link>
        </div>

        <Button
          type='submit'
          className='mt-7 h-12 w-full justify-center text-center text-[15px]'
          disabled={!isValid}
        >
          {isLoading ? <Icon id='button-loading' className='size-6 animate-spin' /> : t('logIn')}
        </Button>
      </form>
    </FormPageLayout>
  );
};

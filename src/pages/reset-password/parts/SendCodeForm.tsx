import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import { Input } from '@components/Input';
import { FormPageLayout } from '@widgets/FormPageLayout';
import { useEffect, useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { sendConfirmationCode, sendForgotPasswordEmail } from '../api';
import { useTimer } from '@shared/hooks/useTimer';
import { Typography } from '@components/Typography';
import { useSearchParams } from 'wouter';

export type ResetPasswordFormData = {
  email: string;
  confirmationCode: string;
}

type SendCodeFormProps = {
  onCodeSubmitted: (formData: ResetPasswordFormData) => void;
}

const MAX_CODE_LENGTH = 10;
const GET_NEW_CODE_TIMER_SECONDS = 120;

export const SendCodeForm: FC<SendCodeFormProps> = ({ onCodeSubmitted }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { handleSubmit, register, formState: { errors, isValid }, getValues, setError, setValue } = useForm<ResetPasswordFormData>({ mode: 'onChange' });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGetNewCodeLoading, setIsGetNewCodeLoading] = useState(false);
  const { currentSeconds, restart: restartTimer } = useTimer({ seconds: GET_NEW_CODE_TIMER_SECONDS, defaultStarted: false });
  const getNewCodeAvailable = currentSeconds === 0;
  const getNewCodeButtonText = getNewCodeAvailable
   ? t('getNewCode')
   : t('getNewCodeIn', { time: `${Math.floor(currentSeconds / 60)}:${(currentSeconds % 60).toString().padStart(2, '0')}` });


  useEffect(() => {
    const userName = searchParams.get('UserName');
    const confirmationCode = searchParams.get('ConfirmationCode');

    if (userName && confirmationCode) {
      setValue('email', userName);
      setValue('confirmationCode', confirmationCode);
      setIsEmailSent(true);
      restartTimer();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, searchParams]);

  const handleSendEmail = async (email: string) => {
    const response = await sendForgotPasswordEmail({ email: email });

    if (response.ok || response.status === 404) {
      setIsEmailSent(true);
      restartTimer();
    }
  };

  const handleCodeSubmit = async (formData: ResetPasswordFormData) => {
    const response = await sendConfirmationCode({ email: formData.email, confirmationCode: formData.confirmationCode });

    if (response.ok) {
      onCodeSubmitted(formData);
    } else if (response.status == 429){
      setError('confirmationCode', { message: t('tooManyIncorrectAttempts') }, { shouldFocus: false });
    } else {
      setError('confirmationCode', { message: t('wrongCode') }, { shouldFocus: false });
    }
  };

  const handleFormSubmit = async (formData: ResetPasswordFormData) => {
    if (isLoading)
      return;

    try {
      setIsLoading(true);

      if (isEmailSent) {
        await handleCodeSubmit(formData);
      } else {
        await handleSendEmail(formData.email);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNewCodeClick = async () => {
    if (isGetNewCodeLoading)
      return;

    try {
      setIsGetNewCodeLoading(true);
      await handleSendEmail(getValues('email'));
    } finally {
      setIsGetNewCodeLoading(false);
    }
  };

  return (
    <FormPageLayout
      className='w-[443px]'
      headerClassName='capitalize'
      headerText={t('resetPassword')}
    >
      <form className='flex size-full flex-col p-6' onSubmit={handleSubmit(handleFormSubmit)}>
        <div className='flex w-full flex-col space-y-4'>
          <Input
            placeholder={t('enterYourEmail')}
            iconId='mail'
            iconClassName='size-5 top-[14px] left-4'
            className='h-12 w-full text-[15px]'
            {...register('email', {
              required: { value: true, message: '' },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: t('invalidEmail'),
              },
            })}
            errorMsg={errors.email?.message}
            disabled={isEmailSent}
          />

          {isEmailSent ?
            <div>
              <Input
                placeholder={t('enterEmailCode')}
                iconId='lock'
                iconClassName='size-5 top-3 left-4'
                className='h-12 w-full text-[15px]'
                {...register('confirmationCode', {
                  required: { value: true, message: '' },
                })}
                errorMsg={errors.confirmationCode?.message}
                maxLength={MAX_CODE_LENGTH}
              />
              <div className='mt-1 flex items-center space-x-1 text-[13px] text-secondary'>
                <Icon id='info' className='size-[14px]' aria-hidden='true' />
                <Typography text={t('codeHasBeenSent')} className='text-[13px] text-inherit first-letter:capitalize' />
              </div>
            </div>
          : null}
        </div>

        <div className='mt-6 space-y-4'>
          {isEmailSent ?
            <Button
              type='button'
              intent='secondary'
              className='h-12 w-full justify-center text-center text-[15px] normal-case'
              onClick={handleGetNewCodeClick}
              disabled={!getNewCodeAvailable}
            >
              {isGetNewCodeLoading ? <Icon id='button-loading' className='size-6 animate-spin' /> : getNewCodeButtonText}
            </Button> : null}

          <Button
            type='submit'
            className='h-12 w-full justify-center text-center text-[15px]'
            disabled={!isValid}
          >
            {isLoading ? <Icon id='button-loading' className='size-6 animate-spin' /> : t('next')}
          </Button>
        </div>
      </form>
    </FormPageLayout>
  );
};

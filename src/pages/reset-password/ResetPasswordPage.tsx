import { useState } from 'react';
import type { ResetPasswordFormData } from './parts/SendCodeForm';
import { SendCodeForm } from './parts/SendCodeForm';
import { CreateNewPasswordForm, type CreateNewPasswordFormData } from '@pages/login/parts/CreateNewPasswordForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useUserStore } from '@shared/stores/userStore';
import { confirmForgotPassword } from './api';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

export const ResetPasswordPage = () => {
  const [resetPasswordFormData, setResetPasswordFormData] = useState<ResetPasswordFormData | undefined>();
  const createPasswordFormMethods = useForm<CreateNewPasswordFormData>({ mode: 'onChange' });
  const logout = useUserStore(state => state.logout);
  const [, navigate] = useLocation();
  const { t } = useTranslation();

const handleForgotPasswordConfirm = async (newPasswordFormData: CreateNewPasswordFormData) => {
  const response = await confirmForgotPassword({
    email: resetPasswordFormData?.email,
    confirmationCode: resetPasswordFormData?.confirmationCode,
    newPassword: newPasswordFormData.newPasswordConfirm,
  });

  switch (response.status) {
    case 200: {
      logout();
      navigate('/login');
      break;
    }
    case 400:
	case 404:{
		createPasswordFormMethods.setError(
			'currentPassword',
			{ message: t('incorrectPassword') },
			{ shouldFocus: false }
		);
	break;
    }
    case 409: {
      createPasswordFormMethods.setError(
        'newPasswordConfirm',
        { message: t('historyValidPassword') },
        { shouldFocus: false }
      );
      break;
    }
  }
};

  return resetPasswordFormData ? (
    <FormProvider {...createPasswordFormMethods}>
      <CreateNewPasswordForm
        onSubmit={handleForgotPasswordConfirm}
      />
    </FormProvider>
  ) : (
    <SendCodeForm
      onCodeSubmitted={(formData) => setResetPasswordFormData(formData)}
    />
  );
};

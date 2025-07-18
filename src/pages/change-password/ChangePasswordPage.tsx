import { changeCurrentPassword } from '@pages/login/api';
import type { CreateNewPasswordFormData } from '@pages/login/parts/CreateNewPasswordForm';
import { CreateNewPasswordForm } from '@pages/login/parts/CreateNewPasswordForm';
import { useUserStore } from '@shared/stores/userStore';
import type { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

export const ChangePasswordPage: FC = () => {
  const formMethods = useForm<CreateNewPasswordFormData>({ mode: 'onChange' });
  const signIn = useUserStore(state => state.signInWithCredentials);
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  const handleFormSubmit = async (formData: CreateNewPasswordFormData) => {
    const response = await changeCurrentPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
     });

     switch (response.status) {
       case 200: {
         const data = await response.json();
         signIn(data);
         navigate('/');
         break;
       }
       case 400:
       case 404: {
         formMethods.setError('currentPassword', { message: t('incorrectPassword') }, { shouldFocus: false });
         break;
       }
       case 409: {
         formMethods.setError('currentPassword', { message: t('historyValidPassword') }, { shouldFocus: false });
         break;
       }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <CreateNewPasswordForm
        onSubmit={handleFormSubmit}
        withCurrentPassword
      />
    </FormProvider>
    );
};

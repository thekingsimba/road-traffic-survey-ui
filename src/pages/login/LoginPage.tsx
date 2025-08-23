import type { AuthUserResponse, SignInRequest } from '@shared/api/typesExtracted';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { changeTemporaryPassword, signIn } from './api';
import { useUserStore } from '@shared/stores/userStore';
import { LoginForm } from './parts/LoginForm';
import { useEffect, useState } from 'react';
import type { CreateNewPasswordFormData } from './parts/CreateNewPasswordForm';
import { CreateNewPasswordForm } from './parts/CreateNewPasswordForm';
import { HTTPError } from 'ky';

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const signInMethods = useForm<SignInRequest>({ mode: 'onChange' });
  const createNewPasswordMethods = useForm<CreateNewPasswordFormData>({ mode: 'onChange' });
  const signInWithCredentials = useUserStore(state => state.signInWithCredentials);
  const isAuthorized = useUserStore(state => state.isAuthorized);
  const [, navigate] = useLocation();
  const [currentUserData, setCurrentUserData] = useState<AuthUserResponse | null>(null);
  const [isShouldChangePassword, setIsShouldChangePassword] = useState(false);

  const handleSignInComplete = (authResponse: AuthUserResponse) => {
    signInWithCredentials(authResponse);
    navigate('/');
    i18n.changeLanguage(i18n.options.fallbackLng?.toString());
  };

  const handleLoginSubmit = async (request: SignInRequest) => {
    try {
      const response = await signIn(request);

      if (response.status === 200) {
        const data = await response.json();

        if (data.success) {
          // Check if user needs to change password (you might need to adjust this logic based on your backend)
          if (data.user?.passwordResetToken) {
            setCurrentUserData(data);
            setIsShouldChangePassword(true);
          } else {
            handleSignInComplete(data);
          }
        } else {
          signInMethods.setError('password', { message: data.message || t('incorrectEmailOrPassword') }, { shouldFocus: false });
        }
      } else if (response.status === 403) {
        signInMethods.setError('password', { message: t('inactiveUser') }, { shouldFocus: false });
      } else if (response.status === 400 || response.status === 404) {
        signInMethods.setError('password', { message: t('incorrectEmailOrPassword') }, { shouldFocus: false });
      } else if (response.status === 429) {
        signInMethods.setError('password', { message: t('toManyRequest') }, { shouldFocus: false });
      } else {
        signInMethods.setError('password', { message: t('incorrectEmailOrPassword') }, { shouldFocus: false });
      }
    } catch (error) {
      console.error('Login error:', error);
      signInMethods.setError('password', { message: t('incorrectEmailOrPassword') }, { shouldFocus: false });
    }
  };

  const handleCreateNewPasswordSubmit = async (formData: CreateNewPasswordFormData) => {
    try {
      if (!currentUserData) {
        throw new Error('No user data available');
      }

      const response = await changeTemporaryPassword({
        newPassword: formData.newPassword,
        passwordResetToken: currentUserData.user?.passwordResetToken as string,
        userName: currentUserData.user?.userName as string
      });

      handleSignInComplete(response);
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 409) {
        createNewPasswordMethods.setError(
          'newPassword',
          { message: t('historyValidPassword') },
          { shouldFocus: false }
        );
      };
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      navigate('/');
    }
  }, [isAuthorized, navigate]);

  return isShouldChangePassword ? (
    <FormProvider {...createNewPasswordMethods}>
      <CreateNewPasswordForm
        onSubmit={handleCreateNewPasswordSubmit}
      />
    </FormProvider>
  ) : (
    <FormProvider {...signInMethods}>
      <LoginForm onSubmit={handleLoginSubmit} />
    </FormProvider>
  );
};

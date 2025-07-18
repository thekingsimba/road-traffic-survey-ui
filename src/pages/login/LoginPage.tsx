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
  const [currentUserData, setCurrentUserData] = useState<AuthUserResponse>({});
  const [isShouldChangePassword, setIsShouldChangePassword] = useState(false);

  const handleSignInComplete = (authResponse: AuthUserResponse) => {
    signInWithCredentials(authResponse);
    navigate('/');
    i18n.changeLanguage(i18n.options.fallbackLng?.toString());
  };

  const handleLoginSubmit = async (request: SignInRequest) => {

    const response = await signIn(request);

    switch (response.status) {
      case 200: {
        const data = await response.json();

        if (data.passwordResetToken) {
          setCurrentUserData(data);
          setIsShouldChangePassword(true);
        } else {
          handleSignInComplete(data);
        }
        break;
      }
      case 403: {
        signInMethods.setError('password', { message: t('inactiveUser') }, { shouldFocus: false });
        break;
      }
      case 400:
      case 404:
      case 409: {
        signInMethods.setError('password', { message: t('incorrectEmailOrPassword') }, { shouldFocus: false });
        break;
      }
      case 429: {
        signInMethods.setError('password', { message: t('toManyRequest') }, { shouldFocus: false });
        break;
      }
    }
  };

  const handleCreateNewPasswordSubmit = async (formData: CreateNewPasswordFormData) => {
    try {
      const response = await changeTemporaryPassword({
        newPassword: formData.newPassword,
        passwordResetToken: currentUserData.passwordResetToken as string,
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
  }, []);

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

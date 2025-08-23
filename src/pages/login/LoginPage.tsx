import type { AuthUserResponse, SignInRequest } from '@shared/api/typesExtracted';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { signIn } from './api';
import { useUserStore } from '@shared/stores/userStore';
import { LoginForm } from './parts/LoginForm';
import { useEffect } from 'react';

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const signInMethods = useForm<SignInRequest>({ mode: 'onChange' });
  const signInWithCredentials = useUserStore(state => state.signInWithCredentials);
  const isAuthorized = useUserStore(state => state.isAuthorized);
  const [, navigate] = useLocation();

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

        if (!data.error) {
          // Login successful - navigate to home page
          handleSignInComplete(data);
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

  useEffect(() => {
    if (isAuthorized) {
      navigate('/');
    }
  }, [isAuthorized, navigate]);

  return (
    <FormProvider {...signInMethods}>
      <LoginForm onSubmit={handleLoginSubmit} />
    </FormProvider>
  );
};

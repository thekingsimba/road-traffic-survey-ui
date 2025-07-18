import { useUserStore } from '@shared/stores/userStore';
import type { FC, PropsWithChildren, ReactNode } from 'react';

type WithAuthorizationProps = {
  fallback?: ReactNode;
}

export const WithAuthorization: FC<PropsWithChildren<WithAuthorizationProps>> = ({ children, fallback }) => {
  const isAuthorized = useUserStore(state => state.isAuthorized);

  return (
    isAuthorized ? children : (fallback ?? null)
  );
};

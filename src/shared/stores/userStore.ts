import type { AuthUserResponse, UserDto } from '@shared/api/typesExtracted';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { AuthStoreBase } from './types';

type UserStore = {
  user?: UserDto | null;
  signInWithCredentials: (authResponse: AuthUserResponse) => void;
  updateUserData: (newUser: Partial<UserDto>) => void;
} & AuthStoreBase

const defaultData: Omit<UserStore, 'signInWithCredentials' | 'logout' | 'updateAccessToken' | 'updateUserData' > = {
  isAuthorized: false,
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        ...defaultData,
        signInWithCredentials: (authResponse) => {
          set({
            isAuthorized: true,
            accessToken: authResponse.token?.accessToken,
            refreshToken: authResponse.token?.refreshToken,
            user: authResponse.user,
          });
        },
        logout: () => {
          set(defaultData);
        },
        updateAccessToken: (token) => {
          set(() => ({ accessToken: token }));
        },
        updateUserData: (newUser: Partial<UserDto>) => {
          set((state) => ({
            user: {
              ...state.user,
              ...newUser,
            },
          }));
        },
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

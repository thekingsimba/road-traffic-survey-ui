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
            accessToken: authResponse.results.token,
            refreshToken: authResponse.results.token, // Using the same token as refresh token for now
            user: {
              id: authResponse.results.user._id,
              email: authResponse.results.user.email,
              full_name: authResponse.results.user.full_name,
              phone: authResponse.results.user.phone,
              role: authResponse.results.user.role,
            },
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
            user: state.user ? {
              ...state.user,
              ...newUser,
            } : undefined,
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

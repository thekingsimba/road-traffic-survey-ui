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
            accessToken: authResponse.token?.token,
            refreshToken: authResponse.token?.token, // Using the same token as refresh token for now
            user: {
              id: authResponse.user._id,
              email: authResponse.user.email,
              full_name: authResponse.user.full_name,
              phone: authResponse.user.phone,
              role: authResponse.user.role,
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

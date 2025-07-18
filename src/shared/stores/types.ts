export type AuthStoreBase = {
  isAuthorized: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
  updateAccessToken: (token: string) => void;
  logout: () => void;
}

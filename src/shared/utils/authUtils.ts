import { useUserStore } from '@shared/stores/userStore';

/**
 * Check if the current user is properly authenticated
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const { isAuthorized, accessToken, user } = useUserStore.getState();
  return !!(isAuthorized && accessToken && user);
};

/**
 * Check if the current user has a specific role
 * @param role - The role to check for
 * @returns boolean indicating if user has the role
 */
export const hasRole = (role: string): boolean => {
  const { user } = useUserStore.getState();
  return user?.role?.name === role;
};

/**
 * Check if the current user is an admin
 * @returns boolean indicating if user is admin
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Check if the current user is an agent
 * @returns boolean indicating if user is agent
 */
export const isAgent = (): boolean => {
  return hasRole('agent');
};

/**
 * Force logout with a specific reason
 * @param reason - The reason for logout
 */
export const forceLogout = (reason?: string): void => {
  const { logout } = useUserStore.getState();
  
  if (reason) {
    alert(`Session expired: ${reason}. Please log in again.`);
  } else {
    alert('Your session has expired. Please log in again.');
  }
  
  logout();
  window.location.href = '/login';
};

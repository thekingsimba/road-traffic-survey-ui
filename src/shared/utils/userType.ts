import type { UserDto } from '@shared/api/typesExtracted';

export type UserType = 'admin' | 'agent' | 'user' | 'unknown';

/**
 * Determines the user type based on the role name
 * @param user - The user object from the store
 * @returns The user type as a string
 */
export const getUserType = (user: UserDto | null | undefined): UserType => {
  if (!user?.role?.name) {
    return 'unknown';
  }

  const roleName = user.role.name.toLowerCase();
  
  switch (roleName) {
    case 'admin':
    case 'super admin':
      return 'admin';
    case 'agent':
      return 'agent';
    case 'user':
      return 'user';
    default:
      return 'unknown';
  }
};

/**
 * Checks if the user is an admin
 * @param user - The user object from the store
 * @returns True if the user is an admin
 */
export const isAdmin = (user: UserDto | null | undefined): boolean => {
  return getUserType(user) === 'admin';
};

/**
 * Checks if the user is an agent
 * @param user - The user object from the store
 * @returns True if the user is an agent
 */
export const isAgent = (user: UserDto | null | undefined): boolean => {
  return getUserType(user) === 'agent';
};

/**
 * Checks if the user is a regular user
 * @param user - The user object from the store
 * @returns True if the user is a regular user
 */
export const isRegularUser = (user: UserDto | null | undefined): boolean => {
  return getUserType(user) === 'user';
};

/**
 * Checks if the user has admin or agent privileges
 * @param user - The user object from the store
 * @returns True if the user is an admin or agent
 */
export const hasElevatedPrivileges = (user: UserDto | null | undefined): boolean => {
  const userType = getUserType(user);
  return userType === 'admin' || userType === 'agent';
};

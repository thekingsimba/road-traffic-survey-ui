import { useUserStore } from '@shared/stores/userStore';
import { getUserType, isAdmin, isAgent, isRegularUser, hasElevatedPrivileges } from '@shared/utils/userType';

/**
 * Custom hook that provides user type information and utility functions
 * @returns Object containing user type information and utility functions
 */
export const useUserType = () => {
  const user = useUserStore((state) => state.user);

  return {
    user,
    userType: getUserType(user),
    isAdmin: isAdmin(user),
    isAgent: isAgent(user),
    isRegularUser: isRegularUser(user),
    hasElevatedPrivileges: hasElevatedPrivileges(user),
  };
};

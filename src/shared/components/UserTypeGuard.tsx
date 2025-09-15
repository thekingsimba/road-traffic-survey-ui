import { useUserType } from '@shared/hooks/useUserType';
import type { UserType } from '@shared/utils/userType';

interface UserTypeGuardProps {
  allowedTypes: UserType[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user type
 * @param allowedTypes - Array of user types that are allowed to see the content
 * @param children - Content to render if user type is allowed
 * @param fallback - Content to render if user type is not allowed (optional)
 */
export const UserTypeGuard = ({ allowedTypes, children, fallback = null }: UserTypeGuardProps) => {
  const { userType } = useUserType();

  if (allowedTypes.includes(userType)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

# User Type Detection

This module provides utilities for detecting and working with user types in the application.

## Features

- **User Type Detection**: Determine if a user is admin, agent, or regular user
- **Utility Functions**: Helper functions for common user type checks
- **Custom Hook**: React hook for easy access to user type information
- **Type Safety**: Full TypeScript support with proper typing

## Usage

### Basic Usage

```typescript
import { useUserType } from '@shared/hooks/useUserType';

function MyComponent() {
  const { userType, isAdmin, isAgent, isRegularUser, hasElevatedPrivileges } = useUserType();

  return (
    <div>
      <p>User type: {userType}</p>
      {isAdmin && <p>Admin content</p>}
      {isAgent && <p>Agent content</p>}
    </div>
  );
}
```

### Using Utility Functions Directly

```typescript
import { getUserType, isAdmin, isAgent } from '@shared/utils/userType';
import { useUserStore } from '@shared/stores/userStore';

function MyComponent() {
  const user = useUserStore((state) => state.user);
  
  const userType = getUserType(user);
  const adminCheck = isAdmin(user);
  const agentCheck = isAgent(user);
}
```

### Using UserTypeGuard Component

```typescript
import { UserTypeGuard } from '@shared/components/UserTypeGuard';

function MyComponent() {
  return (
    <div>
      <UserTypeGuard allowedTypes={['admin']}>
        <p>Only admins can see this</p>
      </UserTypeGuard>
      
      <UserTypeGuard allowedTypes={['admin', 'agent']}>
        <p>Admins and agents can see this</p>
      </UserTypeGuard>
      
      <UserTypeGuard 
        allowedTypes={['admin']} 
        fallback={<p>You don't have permission</p>}
      >
        <p>Admin only content</p>
      </UserTypeGuard>
    </div>
  );
}
```

## User Types

- **admin**: Users with admin privileges
- **agent**: Users with agent privileges  
- **user**: Regular users
- **unknown**: Users without a role or with an unrecognized role

## API Reference

### useUserType Hook

Returns an object with:
- `user`: The current user object
- `userType`: The user type as a string
- `isAdmin`: Boolean indicating if user is admin
- `isAgent`: Boolean indicating if user is agent
- `isRegularUser`: Boolean indicating if user is regular user
- `hasElevatedPrivileges`: Boolean indicating if user has admin or agent privileges

### Utility Functions

- `getUserType(user)`: Returns the user type as a string
- `isAdmin(user)`: Returns true if user is admin
- `isAgent(user)`: Returns true if user is agent
- `isRegularUser(user)`: Returns true if user is regular user
- `hasElevatedPrivileges(user)`: Returns true if user has admin or agent privileges

### UserTypeGuard Component

Props:
- `allowedTypes`: Array of user types that can see the content
- `children`: Content to render if user type is allowed
- `fallback`: Optional content to render if user type is not allowed

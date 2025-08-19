export type SignInRequest = {
    email: string;
    password: string;
}

export type AuthUserResponse = {
    success: boolean;
    message: string;
    token: string
    user: {
        id: string
        email: string
        full_name: string
    }
}

// User Management Types based on backend schema
export type User = {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    picture?: string;
    role?: string;
    countingPost?: 'start' | 'end';
    createdAt?: string;
    updatedAt?: string;
}

export type CreateUserRequest = {
    full_name: string;
    email: string;
    phone?: string;
    password?: string;
    countingPost?: 'start' | 'end';
}

export type UpdateUserRequest = {
    id: string;
    full_name?: string;
    phone?: string;
    picture?: string;
    countingPost?: 'start' | 'end';
}

export type UserFilter = {
    search?: string;
    role?: string;
    countingPost?: 'start' | 'end';
}

export type PaginatedUsersResponse = {
    success: boolean;
    message: string;
    data: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export type UserResponse = {
    success: boolean;
    message: string;
    user: User;
}


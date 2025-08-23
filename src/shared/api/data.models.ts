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
    message: string;
    error: boolean;
    code: number;
    results: {
        docs: User[];
        totalDocs: number;
        page: number;
        limit: number;
        prevPage: number | null;
        nextPage: number | null;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
    };
}

export type UserResponse = {
    success: boolean;
    message: string;
    user: User;
}


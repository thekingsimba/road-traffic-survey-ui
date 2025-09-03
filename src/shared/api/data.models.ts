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
    role?: string | { name: string };
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
    message: string;
    error: boolean;
    code: number;
    results: User;
}

// Survey Management Types based on backend schema
export type Survey = {
    id: string;
    name: string;
    startPoint: string;
    endPoint: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    status: 'active' | 'inactive' | 'archived';
    motorcycleCount: number;
    carCount: number;
    startPointAgent?: string | { id: string; full_name: string; email: string; phone: string };
    endPointAgent?: string | { id: string; full_name: string; email: string; phone: string };
    createdBy: string | { id: string; full_name: string; email: string };
    createdAt?: string;
    updatedAt?: string;
}

export type CreateSurveyRequest = {
    name: string;
    startPoint: string;
    endPoint: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    startPointAgent?: string;
    endPointAgent?: string;
}

export type UpdateSurveyRequest = {
    id: string;
    name?: string;
    startPoint?: string;
    endPoint?: string;
    scheduledStartTime?: string;
    scheduledEndTime?: string;
    startPointAgent?: string;
    endPointAgent?: string;
    status?: 'active' | 'inactive' | 'archived';
}

export type SurveyFilter = {
    search?: string;
    status?: 'active' | 'inactive' | 'archived';
}

export type PaginatedSurveysResponse = {
    message: string;
    error: boolean;
    code: number;
    results: {
        docs: Survey[];
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

export type SurveyResponse = {
    message: string;
    error: boolean;
    code: number;
    results: Survey;
}


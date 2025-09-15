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
    id?: string;
    _id?: string; // MongoDB ObjectId
    name: string;
    startPoint: string;
    endPoint: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    status: 'active' | 'inactive' | 'archived' | 'terminated';
    effectiveStatus?: 'active' | 'inactive' | 'archived' | 'terminated'; // Computed status based on time window
    motorcycleCount: number;
    carCount: number;
    truckCount: number;
    busCount: number;
    pedestrianCount: number;
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

// Counting Data Types
export type CountingData = {
    motorcycle: number;
    car: number;
    truck: number;
    bus: number;
    pedestrian: number;
}

export type SubmitCountingRequest = {
    surveyId: string;
    counts: CountingData;
    countingPost: 'start' | 'end';
}

export type SubmitCountingResponse = {
    message: string;
    error: boolean;
    code: number;
    results: {
        surveyId: string;
        counts: CountingData;
        countingPost: 'start' | 'end';
        submittedAt: string;
    };
}


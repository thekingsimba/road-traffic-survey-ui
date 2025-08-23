export type SignInRequest = {
    email: string;
    password: string;
};

export type AuthUserResponse = {
    message: string;
    error: boolean;
    code: number;
    results: {
        token: string;
        expires_at: string;
        user: {
            _id: string;
            email: string;
            full_name: string;
            phone?: string;
            role?: string;
        };
    };
};

export type UserDto = {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role?: string;
};

export type RefreshTokenRequest = {
    refreshToken: string;
};

export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type CheckForgotPasswordCodeRequest = {
    email: string;
    confirmationCode: string;
};

export type ConfirmForgotPasswordRequest = {
    email: string;
    confirmationCode: string;
    newPassword: string;
};

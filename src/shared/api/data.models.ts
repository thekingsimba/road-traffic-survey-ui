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


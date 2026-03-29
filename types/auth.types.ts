export interface ILoginResponse {
    token: string
    accessToken: string;
    refreshToken: string;
    user: {
        needPasswordChange: boolean;
        email: string;
        name: string;
        role: string;
        image: string;
        status: string;
        isDeleted: string;
        emailVerified: string;
    };
}

export interface IRegisterResponse {
    token: string
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        name: string;
        role: string;
        image: string;
        status: string;
        isDeleted: string;
        emailVerified: string;
    };
}
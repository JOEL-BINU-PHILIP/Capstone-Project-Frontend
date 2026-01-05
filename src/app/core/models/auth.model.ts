import { User } from './user.model';

/**
 * Login request payload
 */
export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

/**
 * Customer registration request
 */
export interface RegisterCustomerRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city: string;
    state: string;
    zipCode: string;
}

/**
 * Technician registration request
 */
export interface RegisterTechnicianRequest extends RegisterCustomerRequest {
    skills: string[];
    experienceYears: number;
    bio?: string;
    idProofType: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

/**
 * Email verification response
 */
export interface EmailVerificationResponse {
    message: string;
    success: boolean;
}

/**
 * Logout request
 */
export interface LogoutRequest {
    refreshToken: string;
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
    User,
    LoginRequest,
    LoginResponse,
    RegisterCustomerRequest,
    RegisterTechnicianRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
    LogoutRequest,
    Role
} from '../models';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/**
 * Authentication service
 * Handles login, logout, registration, token management
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private readonly apiService: ApiService,
        private readonly storageService: StorageService,
        private readonly router: Router
    ) {
        // Initialize user from storage on app start
        this.initializeUser();
    }

    /**
     * Initialize user from storage
     */
    private initializeUser(): void {
        const user = this.storageService.getItem<User>(environment.userKey);
        const token = this.storageService.getItem<string>(environment.tokenKey);

        if (user && token) {
            // Normalize roles in case they have ROLE_ prefix
            const normalizedUser = {
                ...user,
                roles: user.roles.map(role =>
                    typeof role === 'string' ? role.replace('ROLE_', '') as Role : role
                )
            };

            this.currentUserSubject.next(normalizedUser);
            this.isAuthenticatedSubject.next(true);
        }
    }

    /**
     * Login user
     */
    login(credentials: LoginRequest): Observable<any> {
        return this.apiService.post<any>('/api/auth/login', credentials)
            .pipe(
                tap(response => {
                    // Handle both wrapped and direct responses
                    const loginData = response.data || response;
                    this.storeAuthData(loginData);
                }),
                catchError(error => {
                    console.error('Login error:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Register customer
     */
    registerCustomer(data: RegisterCustomerRequest): Observable<any> {
        return this.apiService.post('/api/auth/register/customer', data);
    }

    /**
     * Register technician
     */
    registerTechnician(data: RegisterTechnicianRequest): Observable<any> {
        return this.apiService.post('/api/auth/register/technician', data);
    }

    /**
     * Verify email
     */
    verifyEmail(token: string): Observable<any> {
        return this.apiService.get(`/api/auth/verify-email?token=${token}`);
    }

    /**
     * Resend verification email
     */
    resendVerificationEmail(email: string): Observable<any> {
        return this.apiService.post('/api/auth/resend-verification', { email });
    }

    /**
     * Refresh access token
     */
    refreshToken(): Observable<RefreshTokenResponse> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        const request: RefreshTokenRequest = { refreshToken };

        return this.apiService.post<RefreshTokenResponse>('/api/auth/refresh', request)
            .pipe(
                tap(response => {
                    this.storeTokens(response.accessToken, response.refreshToken);
                }),
                catchError(error => {
                    // If refresh fails, logout user
                    this.logout();
                    return throwError(() => error);
                })
            );
    }

    /**
     * Logout user
     */
    logout(): void {
        const refreshToken = this.getRefreshToken();

        if (refreshToken) {
            const request: LogoutRequest = { refreshToken };
            this.apiService.post('/api/auth/logout', request).subscribe({
                next: () => {
                    this.clearAuthData();
                },
                error: () => {
                    // Even if logout fails on server, clear local data
                    this.clearAuthData();
                }
            });
        } else {
            this.clearAuthData();
        }
    }

    /**
     * Store authentication data
     */
    private storeAuthData(response: LoginResponse): void {
        this.storeTokens(response.accessToken, response.refreshToken);

        // Normalize roles by removing ROLE_ prefix from backend
        const normalizedUser = {
            ...response.user,
            roles: response.user.roles.map(role =>
                role.replace('ROLE_', '') as Role
            )
        };

        this.storageService.setItem(environment.userKey, normalizedUser);
        this.currentUserSubject.next(normalizedUser);
        this.isAuthenticatedSubject.next(true);
    }

    /**
     * Store tokens
     */
    private storeTokens(accessToken: string, refreshToken: string): void {
        this.storageService.setItem(environment.tokenKey, accessToken);
        this.storageService.setItem(environment.refreshTokenKey, refreshToken);
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        this.storageService.removeItem(environment.tokenKey);
        this.storageService.removeItem(environment.refreshTokenKey);
        this.storageService.removeItem(environment.userKey);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth/login']);
    }

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        return this.storageService.getItem<string>(environment.tokenKey);
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return this.storageService.getItem<string>(environment.refreshTokenKey);
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    /**
     * Check if user has a specific role
     */
    hasRole(role: Role): boolean {
        const user = this.getCurrentUser();
        return user ? user.roles.includes(role) : false;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: Role[]): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;
        return roles.some(role => user.roles.includes(role));
    }

    /**
     * Get redirect URL based on user role
     */
    getRedirectUrlByRole(): string {
        const user = this.getCurrentUser();
        if (!user) return '/auth/login';

        // Priority order: ADMIN > SERVICE_MANAGER > TECHNICIAN > CUSTOMER
        if (user.roles.includes(Role.ADMIN)) {
            return '/admin/dashboard';
        } else if (user.roles.includes(Role.SERVICE_MANAGER)) {
            return '/manager/dashboard';
        } else if (user.roles.includes(Role.TECHNICIAN)) {
            return '/technician/dashboard';
        } else if (user.roles.includes(Role.CUSTOMER)) {
            return '/customer/dashboard';
        }

        return '/';
    }

    /**
     * Navigate to role-based dashboard
     */
    navigateToDashboard(): void {
        const url = this.getRedirectUrlByRole();
        this.router.navigate([url]);
    }
}

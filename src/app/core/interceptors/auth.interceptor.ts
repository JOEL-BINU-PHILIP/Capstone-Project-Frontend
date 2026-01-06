import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Auth interceptor - Adds JWT token to requests and handles token refresh
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Skip auth for public endpoints (only for GET requests)
    const publicEndpoints = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/verify-email',
        '/api/auth/resend-verification'
    ];

    // Public GET endpoints (read-only access without auth)
    const publicGetEndpoints = [
        '/api/services/categories',
        '/api/services'
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
    const isPublicGetEndpoint = req.method === 'GET' && publicGetEndpoints.some(endpoint => req.url.includes(endpoint));

    if (isPublicEndpoint || isPublicGetEndpoint) {
        return next(req);
    }

    // Add access token to request
    const token = authService.getAccessToken();

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError(error => {
            // If 401 Unauthorized and not a refresh token request
            if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
                // Try to refresh the token
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        // Retry original request with new token
                        const newToken = authService.getAccessToken();
                        if (newToken) {
                            req = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newToken}`
                                }
                            });
                        }
                        return next(req);
                    }),
                    catchError(refreshError => {
                        // Refresh failed - logout user
                        authService.logout();
                        router.navigate(['/auth/login']);
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};

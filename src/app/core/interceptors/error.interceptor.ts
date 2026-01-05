import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Error interceptor - Global error handling
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError(error => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else if (error.status === 0) {
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            } else if (error.status === 400) {
                errorMessage = error.error?.message || 'Invalid request';
            } else if (error.status === 401) {
                errorMessage = error.error?.message || 'Unauthorized. Please login again.';
            } else if (error.status === 403) {
                errorMessage = error.error?.message || 'Access denied';
            } else if (error.status === 404) {
                errorMessage = error.error?.message || 'Resource not found';
            } else if (error.status === 409) {
                errorMessage = error.error?.message || 'Conflict - resource already exists';
            } else if (error.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else {
                errorMessage = error.error?.message || `Error: ${error.status} - ${error.statusText}`;
            }

            console.error('HTTP Error:', errorMessage, error);

            // Return error with message
            return throwError(() => ({
                ...error,
                userMessage: errorMessage
            }));
        })
    );
};

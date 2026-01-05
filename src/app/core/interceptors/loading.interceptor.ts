import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError, throwError } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

/**
 * Loading interceptor - Shows/hides loading indicator
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Start loading
    loadingService.show();

    return next(req).pipe(
        catchError((error) => {
            // Ensure loader is hidden on error
            loadingService.hide();
            return throwError(() => error);
        }),
        finalize(() => {
            // Hide loading when request completes (success or error)
            loadingService.hide();
        })
    );
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Email verified guard - Ensures user has verified their email
 */
export const emailVerifiedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (user?.emailVerified) {
        return true;
    }

    // Email not verified - redirect to verification page
    router.navigate(['/auth/verify-email']);
    return false;
};

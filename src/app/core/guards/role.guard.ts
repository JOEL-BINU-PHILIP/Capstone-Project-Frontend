import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models';

/**
 * Role guard - Protects routes based on user roles
 * Usage: canActivate: [authGuard, roleGuard], data: { roles: [Role.ADMIN] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRoles = route.data['roles'] as Role[];

    if (!requiredRoles || requiredRoles.length === 0) {
        return true; // No roles required
    }

    if (authService.hasAnyRole(requiredRoles)) {
        return true;
    }

    // User doesn't have required role - redirect to unauthorized page
    router.navigate(['/unauthorized']);
    return false;
};

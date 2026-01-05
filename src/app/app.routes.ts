import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models';

export const routes: Routes = [
    // Default redirect
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    // Public routes
    {
        path: 'home',
        loadComponent: () => import('./modules/public/pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./modules/public/pages/services-browse/services-browse.component').then(m => m.ServicesBrowseComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./modules/public/pages/about/about.component').then(m => m.AboutComponent)
    },

    // Auth routes
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },

    // Customer routes
    {
        path: 'customer',
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.CUSTOMER] },
        loadChildren: () => import('./modules/customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
    },

    // Technician routes
    {
        path: 'technician',
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.TECHNICIAN] },
        loadChildren: () => import('./modules/technician/technician.routes').then(m => m.TECHNICIAN_ROUTES)
    },

    // Service Manager routes
    {
        path: 'manager',
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.SERVICE_MANAGER] },
        loadChildren: () => import('./modules/service-manager/service-manager.routes').then(m => m.MANAGER_ROUTES)
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] },
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },

    // Unauthorized page
    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },

    // 404 - Not Found
    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];

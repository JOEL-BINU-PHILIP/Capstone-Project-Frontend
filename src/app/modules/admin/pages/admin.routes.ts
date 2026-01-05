import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    },
    {
        path: 'users',
        loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./pages/service-catalog/service-catalog-management.component').then(m => m.ServiceCatalogManagementComponent)
    },
    {
        path: 'bookings',
        loadComponent: () => import('../service-manager/pages/all-bookings/all-bookings.component').then(m => m.AllBookingsComponent)
    },
    {
        path: 'technicians',
        loadComponent: () => import('../service-manager/pages/all-technicians/all-technicians.component').then(m => m.AllTechniciansComponent)
    },
    {
        path: 'audit-logs',
        loadComponent: () => import('./pages/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
    },
    {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

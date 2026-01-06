import { Routes } from '@angular/router';

export const MANAGER_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
    },
    {
        path: 'technicians/pending',
        loadComponent: () => import('./pages/pending-technicians/pending-technicians.component').then(m => m.PendingTechniciansComponent)
    },
    {
        path: 'technicians',
        loadComponent: () => import('./pages/all-technicians/all-technicians.component').then(m => m.AllTechniciansComponent)
    },
    {
        path: 'bookings/pending',
        loadComponent: () => import('./pages/pending-bookings/pending-bookings.component').then(m => m.PendingBookingsComponent)
    },
    {
        path: 'bookings/:id',
        loadComponent: () => import('./pages/booking-detail/manager-booking-detail.component').then(m => m.ManagerBookingDetailComponent)
    },
    {
        path: 'bookings',
        loadComponent: () => import('./pages/all-bookings/all-bookings.component').then(m => m.AllBookingsComponent)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

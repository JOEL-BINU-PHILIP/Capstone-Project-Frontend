import { Routes } from '@angular/router';

export const TECHNICIAN_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/technician-dashboard.component').then(m => m.TechnicianDashboardComponent)
    },
    {
        path: 'bookings',
        loadComponent: () => import('./pages/assigned-bookings/assigned-bookings.component').then(m => m.AssignedBookingsComponent)
    },
    {
        path: 'bookings/:id',
        loadComponent: () => import('./pages/technician-booking-detail/technician-booking-detail.component').then(m => m.TechnicianBookingDetailComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/technician-profile.component').then(m => m.TechnicianProfileComponent)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./pages/services-list/services-list.component').then(m => m.ServicesListComponent)
    },
    {
        path: 'booking/create',
        loadComponent: () => import('./pages/create-booking/create-booking.component').then(m => m.CreateBookingComponent)
    },
    {
        path: 'bookings',
        loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
    },
    {
        path: 'bookings/:id',
        loadComponent: () => import('./pages/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent)
    },
    {
        path: 'invoices',
        loadComponent: () => import('./pages/my-invoices/my-invoices.component').then(m => m.MyInvoicesComponent)
    }
];

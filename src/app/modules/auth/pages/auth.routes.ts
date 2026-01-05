import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register/customer',
        loadComponent: () => import('./pages/register-customer/register-customer.component').then(m => m.RegisterCustomerComponent)
    },
    {
        path: 'register/technician',
        loadComponent: () => import('./pages/register-technician/register-technician.component').then(m => m.RegisterTechnicianComponent)
    },
    {
        path: 'verify-email',
        loadComponent: () => import('./pages/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

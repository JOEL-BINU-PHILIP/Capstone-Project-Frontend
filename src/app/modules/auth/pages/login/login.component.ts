import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoginRequest } from '../../../../core/models';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    isSubmitting = false;
    showPassword = false;
    returnUrl: string = '/';

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        // Get return URL from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // Initialize form
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        this.isSubmitting = true;
        const credentials: LoginRequest = this.loginForm.value;

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.notificationService.success('Login successful!');

                // Navigate to dashboard based on role
                setTimeout(() => {
                    this.authService.navigateToDashboard();
                }, 100);
            },
            error: (error) => {
                this.isSubmitting = false;
                const message = error.error?.message || 'Login failed. Please check your credentials.';
                this.notificationService.error(message);

                // Special handling for email verification
                if (message.includes('email') || message.includes('verify')) {
                    this.notificationService.info('Please verify your email before logging in.');
                }
            }
        });
    }

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    /**
     * Mark all fields as touched to show validation errors
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Check if field has error
     */
    hasError(field: string, error: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.hasError(error) && control.touched);
    }
}

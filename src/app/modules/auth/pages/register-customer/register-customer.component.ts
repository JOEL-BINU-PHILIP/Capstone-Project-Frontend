import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RegisterCustomerRequest } from '../../../../core/models';

@Component({
    selector: 'app-register-customer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register-customer.component.html',
    styleUrl: './register-customer.component.css'
})
export class RegisterCustomerComponent implements OnInit {
    registerForm!: FormGroup;
    isSubmitting = false;
    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
            confirmPassword: ['', [Validators.required]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
        }, { validators: this.passwordMatchValidator });
    }

    /**
     * Password strength validator
     */
    private passwordValidator(control: any) {
        const value = control.value;
        if (!value) return null;

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumeric = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
        return valid ? null : { weakPassword: true };
    }

    /**
     * Password match validator
     */
    private passwordMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.markFormGroupTouched(this.registerForm);
            return;
        }

        this.isSubmitting = true;
        const { confirmPassword, ...registerData } = this.registerForm.value;
        const request: RegisterCustomerRequest = registerData;

        this.authService.registerCustomer(request).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.notificationService.success('Registration successful! Please check your email to verify your account.');
                setTimeout(() => {
                    this.router.navigate(['/auth/verify-email']);
                }, 2000);
            },
            error: (error) => {
                this.isSubmitting = false;
                console.error('Registration error details:', error);

                // Check if this might be a false error (registration actually succeeded)
                // HTTP 201 Created is a success status, some errors might be parsing issues
                if (error.status === 201 || error.status === 200) {
                    this.notificationService.success('Registration successful! Please check your email to verify your account.');
                    setTimeout(() => {
                        this.router.navigate(['/auth/verify-email']);
                    }, 2000);
                    return;
                }

                const message = error.error?.message || error.userMessage || 'Registration failed. Please try again.';
                this.notificationService.error(message);
            }
        });
    }

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
        if (field === 'password') {
            this.showPassword = !this.showPassword;
        } else {
            this.showConfirmPassword = !this.showConfirmPassword;
        }
    }

    /**
     * Mark all fields as touched
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
        const control = this.registerForm.get(field);
        return !!(control && control.hasError(error) && control.touched);
    }

    /**
     * Check if form has error
     */
    hasFormError(error: string): boolean {
        return !!(this.registerForm.hasError(error) && this.registerForm.get('confirmPassword')?.touched);
    }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RegisterTechnicianRequest } from '../../../../core/models';

@Component({
  selector: 'app-register-technician',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-technician.component.html',
  styleUrls: ['./register-technician.component.css']
})
export class RegisterTechnicianComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      skillsInput: ['', [Validators.required]],
      experienceYears: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      bio: ['', [Validators.maxLength(500)]],
      idProofType: ['AADHAAR', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Helper method to check if a field has error
  hasError(field: string, error: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  // Helper method to check if field is invalid
  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.invalid) {
      this.notificationService.error('Please fix the validation errors before submitting');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.registerForm.value;

    const request: RegisterTechnicianRequest = {
      ...formValue,
      skills: formValue.skillsInput.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    };

    delete (request as any).skillsInput;
    delete (request as any).confirmPassword;

    this.authService.registerTechnician(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.success('Registration successful! Please verify your email and wait for manager approval.');
        setTimeout(() => this.router.navigate(['/auth/verify-email']), 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        // Check if this is actually a success (201 Created treated as error due to response parsing)
        if (error.status === 201 || error.isSuccess) {
          this.notificationService.success('Registration successful! Please verify your email and wait for manager approval.');
          setTimeout(() => this.router.navigate(['/auth/verify-email']), 2000);
        } else {
          this.notificationService.error(error.error?.message || error.userMessage || 'Registration failed');
        }
      }
    });
  }
}

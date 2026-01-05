import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      skillsInput: ['', [Validators.required]],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      bio: [''],
      idProofType: ['AADHAAR', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.registerForm.value;

    const request: RegisterTechnicianRequest = {
      ...formValue,
      skills: formValue.skillsInput.split(',').map((s: string) => s.trim())
    };

    delete (request as any).skillsInput;
    delete (request as any).confirmPassword;

    this.authService.registerTechnician(request).subscribe({
      next: () => {
        this.notificationService.success('Registration successful! Please verify your email and wait for manager approval.');
        setTimeout(() => this.router.navigate(['/auth/verify-email']), 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.error(error.error?.message || 'Registration failed');
      }
    });
  }
}

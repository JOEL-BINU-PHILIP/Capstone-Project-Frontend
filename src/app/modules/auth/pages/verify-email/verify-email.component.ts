import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  verifying = false;
  verified = false;
  error = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      this.verifyEmail(token);
    }
  }

  verifyEmail(token: string): void {
    this.verifying = true;

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.verifying = false;
        this.verified = true;
        this.notificationService.success('Email verified successfully!');
      },
      error: (error) => {
        this.verifying = false;
        this.error = true;
        this.errorMessage = error.error?.message || 'Verification failed. The link may be expired.';
        this.notificationService.error(this.errorMessage);
      }
    });
  }
}

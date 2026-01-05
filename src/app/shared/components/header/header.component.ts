import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, Role } from '../../../core/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  roles = Role;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasRole(role: Role): boolean {
    return this.authService.hasRole(role);
  }

  getRoleBadge(): string {
    if (!this.currentUser) return '';
    const role = this.currentUser.roles[0];
    switch (role) {
      case Role.ADMIN: return 'Admin';
      case Role.SERVICE_MANAGER: return 'Manager';
      case Role.TECHNICIAN: return 'Technician';
      case Role.CUSTOMER: return 'Customer';
      default: return '';
    }
  }

  navigateHome(): void {
    if (this.currentUser) {
      this.authService.navigateToDashboard();
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

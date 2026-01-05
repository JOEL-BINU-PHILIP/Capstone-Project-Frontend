import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingService } from '../../../../core/services/booking.service';
import { AdminService } from '../../../../core/services/admin.service';
import { Booking, BookingStatus, TechnicianProfile } from '../../../../core/models';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './technician-dashboard.component.html',
  styleUrls: ['./technician-dashboard.component.css']
})
export class TechnicianDashboardComponent implements OnInit {
  user: any = null;
  profile: TechnicianProfile | null = null;
  recentBookings: Booking[] = [];
  stats = {
    assignedBookings: 0,
    inProgressBookings: 0
  };

  constructor(
    private readonly authService: AuthService,
    private readonly bookingService: BookingService,
    private readonly adminService: AdminService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load technician profile using own profile endpoint
    this.adminService.getMyTechnicianProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => console.error('Error loading profile:', error)
    });

    // Load assigned bookings
    this.bookingService.getMyAssignedBookings().subscribe({
      next: (bookings) => {
        // Handle paginated response - bookings might be wrapped
        const bookingList = Array.isArray(bookings) ? bookings : (bookings as any)?.content || [];
        this.recentBookings = bookingList.slice(0, 5);
        this.stats.assignedBookings = bookingList.filter((b: Booking) =>
          b.status === BookingStatus.ASSIGNED || b.status === BookingStatus.CONFIRMED
        ).length;
        this.stats.inProgressBookings = bookingList.filter((b: Booking) =>
          b.status === BookingStatus.IN_PROGRESS
        ).length;
      },
      error: (error) => console.error('Error loading bookings:', error)
    });
  }

  toggleAvailability(): void {
    if (!this.profile) return;

    // Use boolean for availability - backend expects ?available=true/false
    const currentlyAvailable = this.profile.available === true;
    this.adminService.updateAvailability(!currentlyAvailable).subscribe({
      next: () => {
        // Reload profile to get updated state
        this.adminService.getMyTechnicianProfile().subscribe({
          next: (profile) => this.profile = profile
        });
      },
      error: (error) => console.error('Error updating availability:', error)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Booking, BookingStatus, TechnicianProfile } from '../../../../core/models';

@Component({
  selector: 'app-pending-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pending-bookings.component.html',
  styleUrls: ['./pending-bookings.component.css']
})
export class PendingBookingsComponent implements OnInit {
  pendingBookings: Booking[] = [];
  availableTechnicians: TechnicianProfile[] = [];
  loading = false;
  showAssignDialog = false;
  selectedBooking: Booking | null = null;
  selectedTechnicianId = '';

  constructor(
    private readonly bookingService: BookingService,
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadPendingBookings();
  }

  loadPendingBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (response) => {
        const bookings = Array.isArray(response) ? response : response.content || [];
        this.pendingBookings = bookings.filter((b: Booking) => b.status === BookingStatus.PENDING);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.notificationService.error('Failed to load bookings');
        this.loading = false;
      }
    });
  }

  openAssignDialog(booking: Booking): void {
    this.selectedBooking = booking;
    this.selectedTechnicianId = '';
    this.showAssignDialog = true;

    // Load available technicians
    this.adminService.getAllTechnicians('AVAILABLE').subscribe({
      next: (technicians) => {
        this.availableTechnicians = technicians;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
        this.notificationService.error('Failed to load available technicians');
      }
    });
  }

  closeAssignDialog(): void {
    this.showAssignDialog = false;
    this.selectedBooking = null;
    this.selectedTechnicianId = '';
    this.availableTechnicians = [];
  }

  confirmAssign(): void {
    if (!this.selectedBooking?.id || !this.selectedTechnicianId) return;

    const request = { technicianId: this.selectedTechnicianId };
    this.bookingService.assignTechnician(this.selectedBooking.id, request).subscribe({
      next: () => {
        this.notificationService.success('Technician assigned successfully');
        this.pendingBookings = this.pendingBookings.filter(b => b.id !== this.selectedBooking?.id);
        this.closeAssignDialog();
      },
      error: (error) => {
        console.error('Error assigning technician:', error);
        this.notificationService.error('Failed to assign technician');
      }
    });
  }
}

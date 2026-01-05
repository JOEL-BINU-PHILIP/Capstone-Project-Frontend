import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-assigned-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assigned-bookings.component.html',
  styleUrls: ['./assigned-bookings.component.css']
})
export class AssignedBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedStatus: BookingStatus | null = null;
  statusFilters: (BookingStatus | null)[] = [
    null,
    BookingStatus.ASSIGNED,
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED
  ];

  showReject = false;
  selectedBooking: Booking | null = null;
  rejectReason = '';

  constructor(
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyAssignedBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filteredBookings = bookings;
      },
      error: (error) => {
        this.notificationService.error('Failed to load bookings');
        console.error('Error loading bookings:', error);
      }
    });
  }

  filterByStatus(status: BookingStatus | null): void {
    this.selectedStatus = status;
    if (status) {
      this.filteredBookings = this.bookings.filter(b => b.status === status);
    } else {
      this.filteredBookings = this.bookings;
    }
  }

  confirmBooking(bookingId: string, event: Event): void {
    event.stopPropagation();
    this.bookingService.confirmBooking(bookingId).subscribe({
      next: () => {
        this.notificationService.success('Booking confirmed successfully');
        this.loadBookings();
      },
      error: (error) => {
        this.notificationService.error('Failed to confirm booking');
        console.error('Error confirming booking:', error);
      }
    });
  }

  showRejectDialog(booking: Booking, event: Event): void {
    event.stopPropagation();
    this.selectedBooking = booking;
    this.rejectReason = '';
    this.showReject = true;
  }

  closeRejectDialog(): void {
    this.showReject = false;
    this.selectedBooking = null;
    this.rejectReason = '';
  }

  confirmReject(): void {
    if (this.selectedBooking && this.rejectReason) {
      this.bookingService.rejectBooking(this.selectedBooking.id, this.rejectReason).subscribe({
        next: () => {
          this.notificationService.success('Booking rejected');
          this.closeRejectDialog();
          this.loadBookings();
        },
        error: (error) => {
          this.notificationService.error('Failed to reject booking');
          console.error('Error rejecting booking:', error);
        }
      });
    }
  }

  startService(bookingId: string, event: Event): void {
    event.stopPropagation();
    this.bookingService.startService(bookingId).subscribe({
      next: () => {
        this.notificationService.success('Service started');
        this.loadBookings();
      },
      error: (error) => {
        this.notificationService.error('Failed to start service');
        console.error('Error starting service:', error);
      }
    });
  }
}

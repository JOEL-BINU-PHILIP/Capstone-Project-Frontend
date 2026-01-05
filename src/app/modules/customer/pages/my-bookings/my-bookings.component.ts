import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedStatus: BookingStatus | null = null;
  statusFilters: (BookingStatus | null)[] = [
    null,
    BookingStatus.PENDING,
    BookingStatus.ASSIGNED,
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED
  ];

  constructor(
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
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
}

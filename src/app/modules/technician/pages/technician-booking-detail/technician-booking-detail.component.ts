import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking, CompleteBookingRequest } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-technician-booking-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technician-booking-detail.component.html',
  styleUrls: ['./technician-booking-detail.component.css']
})
export class TechnicianBookingDetailComponent implements OnInit {
  booking: Booking | null = null;
  showRejectDialog = false;
  showCompleteDialog = false;
  rejectReason = '';
  completionOtp = '';
  completionNotes = '';
  completionImages: string[] = [];
  imageUrl = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(id);
    }
  }

  loadBooking(id: string): void {
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
      },
      error: (error) => {
        this.notificationService.error('Failed to load booking details');
        console.error('Error loading booking:', error);
        this.router.navigate(['/technician/bookings']);
      }
    });
  }

  confirmBooking(): void {
    if (this.booking) {
      this.bookingService.confirmBooking(this.booking.id).subscribe({
        next: () => {
          this.notificationService.success('Booking confirmed successfully');
          this.loadBooking(this.booking!.id);
        },
        error: (error) => {
          this.notificationService.error('Failed to confirm booking');
          console.error('Error confirming booking:', error);
        }
      });
    }
  }

  rejectBooking(): void {
    if (this.booking && this.rejectReason) {
      this.bookingService.rejectBooking(this.booking.id, this.rejectReason).subscribe({
        next: () => {
          this.notificationService.success('Booking rejected');
          this.showRejectDialog = false;
          this.router.navigate(['/technician/bookings']);
        },
        error: (error) => {
          this.notificationService.error('Failed to reject booking');
          console.error('Error rejecting booking:', error);
        }
      });
    }
  }

  startService(): void {
    if (this.booking) {
      this.bookingService.startService(this.booking.id).subscribe({
        next: () => {
          this.notificationService.success('Service started');
          this.loadBooking(this.booking!.id);
        },
        error: (error) => {
          this.notificationService.error('Failed to start service');
          console.error('Error starting service:', error);
        }
      });
    }
  }

  addImage(): void {
    if (this.imageUrl.trim()) {
      this.completionImages.push(this.imageUrl.trim());
      this.imageUrl = '';
    }
  }

  removeImage(index: number): void {
    this.completionImages.splice(index, 1);
  }

  completeService(): void {
    if (this.booking && this.completionOtp) {
      const request: CompleteBookingRequest = {
        otp: this.completionOtp,
        completionNotes: this.completionNotes || undefined,
        completionImages: this.completionImages.length > 0 ? this.completionImages : undefined
      };

      this.bookingService.completeService(this.booking.id, request).subscribe({
        next: () => {
          this.notificationService.success('Service completed successfully!');
          this.showCompleteDialog = false;
          this.loadBooking(this.booking!.id);
        },
        error: (error) => {
          this.notificationService.error('Failed to complete service. Check OTP.');
          console.error('Error completing service:', error);
        }
      });
    }
  }
}

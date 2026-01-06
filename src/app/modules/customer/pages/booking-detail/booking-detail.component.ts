import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { BillingService } from '../../../../core/services/billing.service';
import { Booking, BookingStatus, Invoice } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  booking: Booking | null = null;
  invoice: Invoice | null = null;
  showCancelDialog = false;
  showRatingDialog = false;
  showOtpDialog = false;

  cancelForm: FormGroup;
  ratingForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService,
    private readonly billingService: BillingService,
    private readonly notificationService: NotificationService
  ) {
    this.cancelForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.ratingForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      feedback: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(id);
    }
  }

  loadBooking(id: string): void {
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        console.log('Booking data received:', booking);
        console.log('Service Address:', booking.serviceAddress);
        this.booking = booking;
        // Load invoice if booking is completed
        if (booking.status === BookingStatus.COMPLETED) {
          this.loadInvoice(booking.id);
        }
      },
      error: (error) => {
        this.notificationService.error('Failed to load booking details');
        console.error('Error loading booking:', error);
        this.router.navigate(['/customer/bookings']);
      }
    });
  }

  loadInvoice(bookingId: string): void {
    this.billingService.getInvoiceByBookingId(bookingId).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
      }
    });
  }

  canPerformActions(): boolean {
    if (!this.booking) return false;
    const status = this.booking.status;
    return status !== BookingStatus.CANCELLED;
  }

  cancelBooking(): void {
    if (this.booking && this.cancelForm.valid) {
      const reason = this.cancelForm.get('reason')?.value;
      this.bookingService.cancelBooking(this.booking.id, reason).subscribe({
        next: () => {
          this.notificationService.success('Booking cancelled successfully');
          this.showCancelDialog = false;
          this.loadBooking(this.booking!.id);
        },
        error: (error) => {
          this.notificationService.error('Failed to cancel booking');
          console.error('Error cancelling booking:', error);
        }
      });
    }
  }

  rateBooking(): void {
    if (this.booking && this.ratingForm.valid) {
      this.bookingService.rateBooking(this.booking.id, this.ratingForm.value).subscribe({
        next: () => {
          this.notificationService.success('Thank you for your feedback!');
          this.showRatingDialog = false;
          this.loadBooking(this.booking!.id);
        },
        error: (error) => {
          this.notificationService.error('Failed to submit rating');
          console.error('Error rating booking:', error);
        }
      });
    }
  }

  generateOtp(): void {
    if (this.booking) {
      this.bookingService.generateOtp(this.booking.id).subscribe({
        next: (otp) => {
          // Response is the OTP string directly (after unwrapping from ApiResponse)
          this.booking!.otp = otp;
          this.notificationService.success('OTP generated successfully');
        },
        error: (error) => {
          this.notificationService.error('Failed to generate OTP');
          console.error('Error generating OTP:', error);
        }
      });
    }
  }
}

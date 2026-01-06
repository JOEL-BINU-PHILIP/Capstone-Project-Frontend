import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingService } from '../../../../core/services/booking.service';
import { BillingService } from '../../../../core/services/billing.service';
import { Booking, BookingStatus, Invoice, InvoiceStatus } from '../../../../core/models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  user: any = null;
  recentBookings: Booking[] = [];
  today = new Date();
  stats = {
    activeBookings: 0,
    completedBookings: 0,
    pendingInvoices: 0
  };

  constructor(
    private readonly authService: AuthService,
    private readonly bookingService: BookingService,
    private readonly billingService: BillingService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load bookings
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        console.log('Bookings response:', response);
        // Extract data from API response wrapper
        const data = response.data || response;
        const bookings = Array.isArray(data) ? data : (data.content || []);
        this.recentBookings = bookings.slice(0, 5);
        this.stats.activeBookings = bookings.filter((b: Booking) =>
          [BookingStatus.PENDING, BookingStatus.ASSIGNED, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS]
            .includes(b.status)
        ).length;
        this.stats.completedBookings = bookings.filter((b: Booking) =>
          b.status === BookingStatus.COMPLETED
        ).length;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.recentBookings = [];
      }
    });

    // Load invoices
    this.billingService.getMyInvoices().subscribe({
      next: (response: any) => {
        console.log('Invoices response:', response);
        // Extract data from API response wrapper
        const data = response.data || response;
        const invoices = Array.isArray(data) ? data : (data.content || []);
        this.stats.pendingInvoices = invoices.filter((i: Invoice) =>
          i.status === InvoiceStatus.PENDING
        ).length;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.stats.pendingInvoices = 0;
      }
    });
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../../../core/services/billing.service';
import { BookingService } from '../../../../core/services/booking.service';
import { RevenueReport, BookingStats } from '../../../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  revenueReport: RevenueReport | null = null;
  bookingStats: BookingStats | null = null;
  loading = false;

  constructor(
    private readonly billingService: BillingService,
    private readonly bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;

    // Load revenue report
    this.billingService.getRevenueReport('2024-01-01', '2026-12-31').subscribe({
      next: (report) => {
        this.revenueReport = report;
      },
      error: (error) => console.error('Error loading revenue report:', error)
    });

    // Load booking stats
    this.bookingService.getBookingStats().subscribe({
      next: (stats) => {
        this.bookingStats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading booking stats:', error);
        this.loading = false;
      }
    });
  }
}

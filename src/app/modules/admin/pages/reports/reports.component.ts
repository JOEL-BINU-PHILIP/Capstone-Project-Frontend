import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../../../core/services/billing.service';
import { BookingService } from '../../../../core/services/booking.service';
import { RevenueReport, DashboardOverview } from '../../../../core/models';

interface CategoryBooking {
  categoryName: string;
  bookingCount: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  revenueReport: RevenueReport | null = null;
  dashboardOverview: DashboardOverview | null = null;
  categoryBookings: CategoryBooking[] = [];
  yAxisTicks: number[] = [];
  maxBookings = 0;
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

    // Load dashboard overview
    this.bookingService.getDashboardOverview().subscribe({
      next: (overview) => {
        this.dashboardOverview = overview;
        this.computeCategoryBookings(overview.bookingsByCategory);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard overview:', error);
        this.loading = false;
      }
    });
  }

  private computeCategoryBookings(bookingsByCategory: Record<string, number>): void {
    if (!bookingsByCategory || Object.keys(bookingsByCategory).length === 0) {
      this.categoryBookings = [];
      return;
    }

    // Convert to array and sort by booking count
    this.categoryBookings = Object.entries(bookingsByCategory)
      .map(([categoryName, bookingCount]) => ({ categoryName, bookingCount }))
      .sort((a, b) => b.bookingCount - a.bookingCount);

    // Calculate max and y-axis ticks
    this.maxBookings = Math.max(...this.categoryBookings.map(c => c.bookingCount), 1);
    this.calculateYAxisTicks();
  }

  private calculateYAxisTicks(): void {
    const tickCount = 5;
    const step = Math.ceil(this.maxBookings / tickCount);
    this.yAxisTicks = [];
    for (let i = tickCount; i >= 0; i--) {
      this.yAxisTicks.push(i * step);
    }
  }

  getBarHeight(bookingCount: number): number {
    if (this.maxBookings === 0) return 0;
    return (bookingCount / this.maxBookings) * 100;
  }
}

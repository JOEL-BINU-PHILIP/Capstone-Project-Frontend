import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingService } from '../../../../core/services/billing.service';
import { Invoice, InvoiceStatus, PaymentMethod } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-my-invoices',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.css']
})
export class MyInvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  selectedStatus: InvoiceStatus | null = null;
  statusFilters: (InvoiceStatus | null)[] = [null, InvoiceStatus.PENDING, InvoiceStatus.PAID, InvoiceStatus.CANCELLED];

  showPaymentDialog = false;
  selectedInvoice: Invoice | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  paymentMethods = [PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.UPI, PaymentMethod.ONLINE];

  constructor(
    private readonly billingService: BillingService,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.billingService.getMyInvoices().subscribe({
      next: (invoices) => {
        console.log('Invoices received in component:', invoices);
        this.invoices = [...invoices]; // Create new array reference
        this.filteredInvoices = [...invoices];
        this.cdr.detectChanges(); // Force change detection
        console.log('After setting - invoices:', this.invoices.length, 'filtered:', this.filteredInvoices.length);
      },
      error: (error) => {
        this.notificationService.error('Failed to load invoices');
        console.error('Error loading invoices:', error);
      }
    });
  }

  filterByStatus(status: InvoiceStatus | null): void {
    this.selectedStatus = status;
    if (status) {
      this.filteredInvoices = this.invoices.filter(i => i.status === status);
    } else {
      this.filteredInvoices = this.invoices;
    }
  }

  payInvoice(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.selectedPaymentMethod = null;
    this.showPaymentDialog = true;
  }

  getPaymentIcon(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CASH: return '💵';
      case PaymentMethod.CARD: return '💳';
      case PaymentMethod.UPI: return '📱';
      case PaymentMethod.ONLINE: return '🌐';
      default: return '💰';
    }
  }

  confirmPayment(): void {
    if (this.selectedInvoice && this.selectedPaymentMethod) {
      this.billingService.payInvoice(this.selectedInvoice.id, {
        paymentMethod: this.selectedPaymentMethod
      }).subscribe({
        next: () => {
          this.notificationService.success('Payment successful!');
          this.showPaymentDialog = false;
          this.loadInvoices();
        },
        error: (error) => {
          this.notificationService.error('Payment failed');
          console.error('Error processing payment:', error);
        }
      });
    }
  }
}

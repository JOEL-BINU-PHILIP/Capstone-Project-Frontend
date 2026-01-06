import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillingService } from '../../../../core/services/billing.service';
import { Invoice, PaymentMethod } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-invoice-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
    invoice: Invoice | null = null;
    loading = true;

    showPaymentDialog = false;
    selectedPaymentMethod: PaymentMethod | null = null;
    paymentMethods = [PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.UPI, PaymentMethod.ONLINE];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly billingService: BillingService,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        const invoiceId = this.route.snapshot.paramMap.get('id');
        if (invoiceId) {
            this.loadInvoice(invoiceId);
        }
    }

    loadInvoice(id: string): void {
        this.loading = true;
        this.billingService.getInvoiceById(id).subscribe({
            next: (invoice) => {
                this.invoice = invoice;
                this.loading = false;
            },
            error: (error) => {
                this.notificationService.error('Failed to load invoice');
                console.error('Error loading invoice:', error);
                this.loading = false;
                this.router.navigate(['/customer/invoices']);
            }
        });
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

    getStatusClass(status: string): string {
        return 'status-' + status.toLowerCase();
    }

    openPaymentDialog(): void {
        this.selectedPaymentMethod = null;
        this.showPaymentDialog = true;
    }

    confirmPayment(): void {
        if (this.invoice && this.selectedPaymentMethod) {
            this.billingService.payInvoice(this.invoice.id, {
                paymentMethod: this.selectedPaymentMethod
            }).subscribe({
                next: () => {
                    this.notificationService.success('Payment successful!');
                    this.showPaymentDialog = false;
                    this.loadInvoice(this.invoice!.id);
                },
                error: (error) => {
                    this.notificationService.error('Payment failed');
                    console.error('Error processing payment:', error);
                }
            });
        }
    }

    printInvoice(): void {
        globalThis.print();
    }

    goBack(): void {
        this.router.navigate(['/customer/invoices']);
    }
}

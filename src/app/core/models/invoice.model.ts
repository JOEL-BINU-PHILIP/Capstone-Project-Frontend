import { InvoiceStatus, PaymentMethod } from './enums';

/**
 * Invoice
 */
export interface Invoice {
    id: string;
    invoiceNumber: string;
    bookingId: string;
    bookingNumber: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    status: InvoiceStatus;
    paymentMethod?: PaymentMethod;
    paidAt?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Pay invoice request
 */
export interface PayInvoiceRequest {
    paymentMethod: PaymentMethod;
    notes?: string;
}

/**
 * Revenue report
 */
export interface RevenueReport {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    paidAmount: number;
    pendingAmount: number;
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
    cancelledInvoices: number;
    paymentMethodBreakdown: PaymentMethodBreakdown[];
}

/**
 * Payment method breakdown
 */
export interface PaymentMethodBreakdown {
    method: PaymentMethod;
    count: number;
    amount: number;
}

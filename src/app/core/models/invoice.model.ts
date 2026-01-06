import { InvoiceStatus, PaymentMethod } from './enums';

/**
 * Invoice - matches backend InvoiceResponse
 */
export interface Invoice {
    id: string;
    invoiceNumber: string;

    // Booking
    bookingId: string;
    bookingNumber: string;

    // Customer
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;

    // Service
    serviceId?: string;
    serviceName: string;
    categoryName?: string;

    // Technician
    technicianId?: string;
    technicianName?: string;

    // Pricing
    basePrice: number;
    taxPercentage?: number;
    taxAmount: number;
    discountPercentage?: number;
    discountAmount?: number;
    totalAmount: number;
    currency?: string;

    // Status
    status: InvoiceStatus;
    isPaid?: boolean;

    // Payment Info
    paymentMethod?: PaymentMethod;
    paidAt?: string;

    // Dates
    invoiceDate?: string;
    dueDate?: string;

    // Notes
    notes?: string;

    // Audit
    createdAt: string;
    updatedAt?: string;
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

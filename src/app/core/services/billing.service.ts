import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Invoice,
    PayInvoiceRequest,
    RevenueReport,
    InvoiceStatus
} from '../models';

/**
 * Billing API Service
 */
@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private readonly basePath = '/api/billing';

    constructor(private readonly apiService: ApiService) { }

    /**
     * Get invoice by ID
     */
    getInvoiceById(id: string): Observable<Invoice> {
        return this.apiService.get<Invoice>(`${this.basePath}/invoices/${id}`);
    }

    /**
     * Get invoice by invoice number
     */
    getInvoiceByNumber(invoiceNumber: string): Observable<Invoice> {
        return this.apiService.get<Invoice>(`${this.basePath}/invoices/number/${invoiceNumber}`);
    }

    /**
     * Get invoice by booking ID
     */
    getInvoiceByBookingId(bookingId: string): Observable<Invoice> {
        return this.apiService.get<Invoice>(`${this.basePath}/invoices/booking/${bookingId}`);
    }

    /**
     * Get my invoices (Customer)
     */
    getMyInvoices(): Observable<Invoice[]> {
        return this.apiService.get<Invoice[]>(`${this.basePath}/invoices?user=me`);
    }

    /**
     * Get invoices by customer ID (Admin/Manager)
     */
    getInvoicesByCustomer(customerId: string): Observable<Invoice[]> {
        return this.apiService.get<Invoice[]>(`${this.basePath}/invoices?customerId=${customerId}`);
    }

    /**
     * Get invoices by status
     */
    getInvoicesByStatus(status: InvoiceStatus): Observable<Invoice[]> {
        return this.apiService.get<Invoice[]>(`${this.basePath}/invoices?status=${status}`);
    }

    /**
     * Search invoices
     */
    searchInvoices(query: string): Observable<Invoice[]> {
        return this.apiService.get<Invoice[]>(`${this.basePath}/invoices/search?query=${encodeURIComponent(query)}`);
    }

    /**
     * Pay invoice
     */
    payInvoice(id: string, request: PayInvoiceRequest): Observable<Invoice> {
        return this.apiService.post<Invoice>(`${this.basePath}/invoices/${id}/pay`, request);
    }

    /**
     * Get revenue report (Admin/Manager)
     */
    getRevenueReport(startDate: string, endDate: string): Observable<RevenueReport> {
        return this.apiService.get<RevenueReport>(
            `${this.basePath}/invoices/reports/revenue?startDate=${startDate}&endDate=${endDate}`
        );
    }
}

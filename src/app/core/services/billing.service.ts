import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
        return this.apiService.get<any>(`${this.basePath}/invoices/${id}`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get invoice by invoice number
     */
    getInvoiceByNumber(invoiceNumber: string): Observable<Invoice> {
        return this.apiService.get<any>(`${this.basePath}/invoices/number/${invoiceNumber}`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get invoice by booking ID
     */
    getInvoiceByBookingId(bookingId: string): Observable<Invoice> {
        return this.apiService.get<any>(`${this.basePath}/invoices/booking/${bookingId}`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get my invoices (Customer)
     */
    getMyInvoices(): Observable<Invoice[]> {
        return this.apiService.get<any>(`${this.basePath}/invoices?user=me`).pipe(
            map(response => {
                console.log('Raw billing response:', response);
                // Handle wrapped response { data: { content: [...] } } or { data: [...] } or direct array
                const data = response?.data || response;
                // Check if paginated (has content property)
                if (data?.content) {
                    return Array.isArray(data.content) ? data.content : [];
                }
                return Array.isArray(data) ? data : [];
            })
        );
    }

    /**
     * Get invoices by customer ID (Admin/Manager)
     */
    getInvoicesByCustomer(customerId: string): Observable<Invoice[]> {
        return this.apiService.get<any>(`${this.basePath}/invoices?customerId=${customerId}`).pipe(
            map(response => {
                const data = response?.data || response;
                return Array.isArray(data) ? data : [];
            })
        );
    }

    /**
     * Get invoices by status
     */
    getInvoicesByStatus(status: InvoiceStatus): Observable<Invoice[]> {
        return this.apiService.get<any>(`${this.basePath}/invoices?status=${status}`).pipe(
            map(response => {
                const data = response?.data || response;
                return Array.isArray(data) ? data : [];
            })
        );
    }

    /**
     * Search invoices
     */
    searchInvoices(query: string): Observable<Invoice[]> {
        return this.apiService.get<any>(`${this.basePath}/invoices/search?query=${encodeURIComponent(query)}`).pipe(
            map(response => {
                const data = response?.data || response;
                return Array.isArray(data) ? data : [];
            })
        );
    }

    /**
     * Pay invoice
     */
    payInvoice(id: string, request: PayInvoiceRequest): Observable<Invoice> {
        return this.apiService.post<any>(`${this.basePath}/invoices/${id}/pay`, request).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get revenue report (Admin/Manager)
     */
    getRevenueReport(startDate: string, endDate: string): Observable<RevenueReport> {
        return this.apiService.get<any>(
            `${this.basePath}/invoices/reports/revenue?startDate=${startDate}&endDate=${endDate}`
        ).pipe(
            map(response => response?.data || response)
        );
    }
}

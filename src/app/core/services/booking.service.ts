import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Booking,
    CreateBookingRequest,
    RescheduleBookingRequest,
    AssignTechnicianRequest,
    CompleteBookingRequest,
    RateBookingRequest,
    BookingStats,
    BookingStatus,
    PagedResponse
} from '../models';

/**
 * Booking API Service
 */
@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly basePath = '/api/bookings';

    constructor(private readonly apiService: ApiService) { }

    // ========== CUSTOMER OPERATIONS ==========

    /**
     * Create new booking (Customer)
     */
    createBooking(request: CreateBookingRequest): Observable<Booking> {
        return this.apiService.post<Booking>(this.basePath, request);
    }

    /**
     * Get my bookings (Customer)
     */
    getMyBookings(): Observable<Booking[]> {
        return this.apiService.get<Booking[]>(this.basePath);
    }

    /**
     * Get booking by ID
     */
    getBookingById(id: string): Observable<Booking> {
        return this.apiService.get<Booking>(`${this.basePath}/${id}`);
    }

    /**
     * Get booking by number
     */
    getBookingByNumber(bookingNumber: string): Observable<Booking> {
        return this.apiService.get<Booking>(`${this.basePath}/number/${bookingNumber}`);
    }

    /**
     * Reschedule booking (Customer)
     */
    rescheduleBooking(id: string, request: RescheduleBookingRequest): Observable<Booking> {
        return this.apiService.put<Booking>(`${this.basePath}/${id}/reschedule`, request);
    }

    /**
     * Cancel booking (Customer)
     */
    cancelBooking(id: string, reason: string): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/cancel`, { reason });
    }

    /**
     * Generate OTP for completion (Customer)
     */
    generateOtp(id: string): Observable<{ otp: string }> {
        return this.apiService.post<{ otp: string }>(`${this.basePath}/${id}/generate-otp`, {});
    }

    /**
     * Rate booking (Customer)
     */
    rateBooking(id: string, request: RateBookingRequest): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/rate`, request);
    }

    // ========== TECHNICIAN OPERATIONS ==========

    /**
     * Get my assigned bookings (Technician)
     */
    getMyAssignedBookings(): Observable<Booking[]> {
        return this.apiService.get<Booking[]>(this.basePath);
    }

    /**
     * Get active bookings (Technician)
     */
    getActiveBookings(): Observable<Booking[]> {
        return this.apiService.get<Booking[]>(`${this.basePath}/technician/active`);
    }

    /**
     * Confirm booking (Technician)
     */
    confirmBooking(id: string): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/confirm`, {});
    }

    /**
     * Reject booking (Technician)
     */
    rejectBooking(id: string, reason: string): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/reject`, { reason });
    }

    /**
     * Start service (Technician)
     */
    startService(id: string): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/start`, {});
    }

    /**
     * Complete service (Technician)
     */
    completeService(id: string, request: CompleteBookingRequest): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/complete`, request);
    }

    // ========== SERVICE MANAGER OPERATIONS ==========

    /**
     * Get pending bookings (Service Manager)
     */
    getPendingBookings(): Observable<Booking[]> {
        return this.apiService.get<Booking[]>(`${this.basePath}/pending`);
    }

    /**
     * Assign technician to booking (Service Manager)
     */
    assignTechnician(id: string, request: AssignTechnicianRequest): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/assign`, request);
    }

    /**
     * Reassign technician (Service Manager)
     */
    reassignTechnician(id: string, request: AssignTechnicianRequest): Observable<Booking> {
        return this.apiService.post<Booking>(`${this.basePath}/${id}/reassign`, request);
    }

    /**
     * Search bookings (Service Manager)
     */
    searchBookings(query: string): Observable<Booking[]> {
        return this.apiService.get<Booking[]>(`${this.basePath}/search?query=${encodeURIComponent(query)}`);
    }

    /**
     * Get bookings by status (Service Manager)
     */
    getBookingsByStatus(status: BookingStatus): Observable<Booking[]> {
        return this.apiService.get<Booking[]>(`${this.basePath}/status/${status}`);
    }

    // ========== ADMIN OPERATIONS ==========

    /**
     * Get all bookings (Admin - paginated)
     */
    getAllBookings(page: number = 0, size: number = 20): Observable<PagedResponse<Booking>> {
        return this.apiService.get<PagedResponse<Booking>>(`${this.basePath}/all?page=${page}&size=${size}`);
    }

    /**
     * Get booking statistics (Admin)
     */
    getBookingStats(): Observable<BookingStats> {
        return this.apiService.get<BookingStats>(`${this.basePath}/reports/stats`);
    }
}

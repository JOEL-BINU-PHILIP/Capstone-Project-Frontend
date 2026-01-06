import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
    Booking,
    CreateBookingRequest,
    RescheduleBookingRequest,
    AssignTechnicianRequest,
    CompleteBookingRequest,
    RateBookingRequest,
    DashboardOverview,
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
        return this.apiService.post<any>(this.basePath, request).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get my bookings (Customer)
     */
    getMyBookings(): Observable<Booking[]> {
        return this.apiService.get<any>(this.basePath).pipe(
            map(response => {
                // Handle wrapped response { data: [...] } or direct array
                const bookings = response?.data || response;
                return Array.isArray(bookings) ? bookings : [];
            })
        );
    }

    /**
     * Get booking by ID
     */
    getBookingById(id: string): Observable<Booking> {
        return this.apiService.get<any>(`${this.basePath}/${id}`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get booking by number
     */
    getBookingByNumber(bookingNumber: string): Observable<Booking> {
        return this.apiService.get<any>(`${this.basePath}/number/${bookingNumber}`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Reschedule booking (Customer)
     */
    rescheduleBooking(id: string, request: RescheduleBookingRequest): Observable<Booking> {
        return this.apiService.put<any>(`${this.basePath}/${id}/reschedule`, request).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Cancel booking (Customer)
     */
    cancelBooking(id: string, reason: string): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/cancel`, { reason }).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Generate OTP for completion (Customer)
     * Backend returns OTP as string directly in data field
     */
    generateOtp(id: string): Observable<string> {
        return this.apiService.post<any>(`${this.basePath}/${id}/generate-otp`, {}).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Rate booking (Customer)
     */
    rateBooking(id: string, request: RateBookingRequest): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/rate`, request).pipe(
            map(response => response?.data || response)
        );
    }

    // ========== TECHNICIAN OPERATIONS ==========

    /**
     * Get my assigned bookings (Technician)
     */
    getMyAssignedBookings(): Observable<Booking[]> {
        return this.apiService.get<any>(this.basePath).pipe(
            map(response => {
                const bookings = response?.data || response;
                return Array.isArray(bookings) ? bookings : [];
            })
        );
    }

    /**
     * Get active bookings (Technician)
     */
    getActiveBookings(): Observable<Booking[]> {
        return this.apiService.get<any>(`${this.basePath}/technician/active`).pipe(
            map(response => {
                const bookings = response?.data || response;
                return Array.isArray(bookings) ? bookings : [];
            })
        );
    }

    /**
     * Confirm booking (Technician)
     */
    confirmBooking(id: string): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/confirm`, {}).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Reject booking (Technician)
     */
    rejectBooking(id: string, reason: string): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/reject`, { reason }).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Start service (Technician)
     */
    startService(id: string): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/start`, {}).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Complete service (Technician)
     */
    completeService(id: string, request: CompleteBookingRequest): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/complete`, request).pipe(
            map(response => response?.data || response)
        );
    }

    // ========== SERVICE MANAGER OPERATIONS ==========

    /**
     * Get pending bookings (Service Manager)
     */
    getPendingBookings(): Observable<Booking[]> {
        return this.apiService.get<any>(`${this.basePath}/pending`).pipe(
            map(response => {
                const bookings = response?.data || response;
                return Array.isArray(bookings) ? bookings : [];
            })
        );
    }

    /**
     * Assign technician to booking (Service Manager)
     */
    assignTechnician(id: string, request: AssignTechnicianRequest): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/assign`, request).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Reassign technician (Service Manager)
     */
    reassignTechnician(id: string, request: AssignTechnicianRequest): Observable<Booking> {
        return this.apiService.post<any>(`${this.basePath}/${id}/reassign`, request).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Search bookings (Service Manager)
     */
    searchBookings(query: string): Observable<Booking[]> {
        return this.apiService.get<any>(`${this.basePath}/search?query=${encodeURIComponent(query)}`).pipe(
            map(response => {
                const bookings = response?.data || response;
                return Array.isArray(bookings) ? bookings : [];
            })
        );
    }

    /**
     * Get bookings by status (Service Manager)
     */
    getBookingsByStatus(status: BookingStatus): Observable<Booking[]> {
        return this.apiService.get<any>(`${this.basePath}/status/${status}`).pipe(
            map(response => {
                const bookings = response?.data || response;
                return Array.isArray(bookings) ? bookings : [];
            })
        );
    }

    // ========== ADMIN OPERATIONS ==========

    /**
     * Get all bookings (Admin - paginated)
     */
    getAllBookings(page: number = 0, size: number = 20): Observable<PagedResponse<Booking>> {
        return this.apiService.get<any>(`${this.basePath}/all?page=${page}&size=${size}`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get dashboard overview (Admin/Service Manager)
     */
    getDashboardOverview(): Observable<DashboardOverview> {
        return this.apiService.get<any>(`${this.basePath}/dashboard/overview`).pipe(
            map(response => response?.data || response)
        );
    }

    /**
     * Get bookings by category report
     */
    getBookingsByCategory(): Observable<Map<string, number>> {
        return this.apiService.get<any>(`${this.basePath}/dashboard/reports?type=CATEGORY`).pipe(
            map(response => response?.data?.data || response?.data || {})
        );
    }
}

import { BookingStatus, BookingPriority } from './enums';

/**
 * Address Details (nested in booking response)
 */
export interface AddressDetails {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
}

/**
 * Booking
 */
export interface Booking {
    id: string;
    bookingNumber: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    technicianId?: string;
    technicianName?: string;
    status: BookingStatus;
    problemDescription: string;
    imageUrls?: string[];
    scheduledDate: string;
    priority: BookingPriority;
    // Address - nested object from backend
    serviceAddress?: AddressDetails;
    // Flat address fields (for backward compatibility)
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    specialInstructions?: string;
    completionImages?: string[];
    completionNotes?: string;
    rating?: number;
    feedback?: string;
    otp?: string;
    otpGeneratedAt?: string;
    cancellationReason?: string;
    rescheduleReason?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create booking request
 */
export interface CreateBookingRequest {
    serviceId: string;
    problemDescription: string;
    imageUrls?: string[];
    scheduledDate: string;
    priority: BookingPriority;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
    specialInstructions?: string;
}

/**
 * Reschedule booking request
 */
export interface RescheduleBookingRequest {
    newScheduledDate: string;
    reason: string;
}

/**
 * Cancel booking request
 */
export interface CancelBookingRequest {
    reason: string;
}

/**
 * Assign technician request
 */
export interface AssignTechnicianRequest {
    technicianId: string;
}

/**
 * Reassign technician request
 */
export interface ReassignTechnicianRequest {
    technicianId: string;
    reason: string;
}

/**
 * Reject booking request (technician)
 */
export interface RejectBookingRequest {
    reason: string;
}

/**
 * Complete booking request (technician)
 */
export interface CompleteBookingRequest {
    otp: string;
    completionImages?: string[];
    completionNotes?: string;
}

/**
 * Rate booking request (customer)
 */
export interface RateBookingRequest {
    rating: number;
    feedback?: string;
}

/**
 * OTP generation response
 */
export interface OtpResponse {
    otp: string;
    expiresAt: string;
    message: string;
}

/**
 * Booking statistics (for dashboard)
 */
export interface BookingStats {
    totalBookings: number;
    pendingBookings: number;
    assignedBookings: number;
    confirmedBookings: number;
    inProgressBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    averageRating?: number;
    topServices?: TopService[];
}

/**
 * Top service statistics
 */
export interface TopService {
    serviceName: string;
    bookingCount: number;
    revenue: number;
}

/**
 * Dashboard Overview (from /api/bookings/dashboard/overview)
 */
export interface DashboardOverview {
    totalBookings: number;
    pendingBookings: number;
    assignedBookings: number;
    inProgressBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    todayBookings: number;
    todayCompleted: number;
    weekBookings: number;
    weekCompleted: number;
    monthBookings: number;
    monthCompleted: number;
    avgRating: number;
    avgResolutionTimeHours: number;
    bookingsByStatus: Record<string, number>;
    bookingsByCategory: Record<string, number>;
}

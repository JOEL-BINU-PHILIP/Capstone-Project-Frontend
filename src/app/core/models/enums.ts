/**
 * User roles in the system
 */
export enum Role {
    CUSTOMER = 'CUSTOMER',
    TECHNICIAN = 'TECHNICIAN',
    SERVICE_MANAGER = 'SERVICE_MANAGER',
    ADMIN = 'ADMIN'
}

/**
 * Technician status
 */
export enum TechnicianStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

/**
 * Technician availability
 */
export enum TechnicianAvailability {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE'
}

/**
 * Booking status
 */
export enum BookingStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    CONFIRMED = 'CONFIRMED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

/**
 * Booking priority
 */
export enum BookingPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

/**
 * Invoice status
 */
export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

/**
 * Payment method
 */
export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    UPI = 'UPI',
    ONLINE = 'ONLINE'
}

/**
 * ID Proof types
 */
export enum IdProofType {
    AADHAAR = 'AADHAAR',
    PAN = 'PAN',
    DRIVING_LICENSE = 'DRIVING_LICENSE',
    PASSPORT = 'PASSPORT'
}

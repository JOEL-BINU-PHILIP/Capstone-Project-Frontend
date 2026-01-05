/**
 * Audit log entry
 */
export interface AuditLog {
    id: string;
    userId: string;
    username: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    ipAddress: string;
    userAgent?: string;
    details?: string;
    timestamp: string;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

/**
 * Update technician profile request
 */
export interface UpdateTechnicianProfileRequest {
    bio?: string;
    skills: string[];
    experienceYears: number;
}

/**
 * Update availability request
 */
export interface UpdateAvailabilityRequest {
    availability: 'AVAILABLE' | 'UNAVAILABLE';
}

/**
 * Approve technician request
 */
export interface ApproveTechnicianRequest {
    // Empty - just POST to endpoint
}

/**
 * Reject technician request
 */
export interface RejectTechnicianRequest {
    reason: string;
}

/**
 * Assign role request
 */
export interface AssignRoleRequest {
    role: string;
}

/**
 * Lock user request
 */
export interface LockUserRequest {
    reason: string;
}

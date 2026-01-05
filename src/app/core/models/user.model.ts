import { Role, TechnicianStatus, TechnicianAvailability } from './enums';

/**
 * Base user interface
 */
export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    roles: Role[];
    emailVerified: boolean;
    accountLocked: boolean;
    city?: string;
    state?: string;
    zipCode?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Technician profile interface
 * Matches TechnicianProfileResponseDTO from backend
 */
export interface TechnicianProfile {
    id: string;
    userId: string;
    // User info from backend
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    // Technician details
    skills: string[];
    experienceYears?: number;
    experience?: number;
    specialization?: string;
    certification?: string;
    documentsUrl?: string[];
    bio?: string;
    city?: string;
    state?: string;
    // Status fields
    status?: TechnicianStatus;
    approvalStatus?: string;
    availability?: TechnicianAvailability;
    available?: boolean;
    // Stats
    completedJobs?: number;
    totalJobsCompleted?: number;
    averageRating?: number;
    // Documents
    idProofType?: string;
    idProofUrl?: string;
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * User with technician profile (for profile page)
 */
export interface UserWithTechnician extends User {
    technicianProfile?: TechnicianProfile;
}

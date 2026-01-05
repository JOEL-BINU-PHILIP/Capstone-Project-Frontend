import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
    User,
    TechnicianProfile,
    AuditLog,
    PagedResponse,
    Role
} from '../models';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Admin API Service
 */
@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly authBasePath = '/api';

    constructor(private readonly apiService: ApiService) { }

    // ========== USER MANAGEMENT ==========

    /**
     * Get all users (paginated)
     */
    getAllUsers(page: number = 0, size: number = 20): Observable<PagedResponse<User>> {
        return this.apiService.get<PagedResponse<User>>(
            `${this.authBasePath}/admin/users?page=${page}&size=${size}`
        );
    }

    /**
     * Get user by ID
     */
    getUserById(id: string): Observable<User> {
        return this.apiService.get<User>(`${this.authBasePath}/admin/users/${id}`);
    }

    /**
     * Get users by role
     */
    getUsersByRole(role: Role): Observable<User[]> {
        return this.apiService.get<User[]>(`${this.authBasePath}/admin/users/role/${role}`);
    }

    /**
     * Assign role to user
     */
    assignRole(userId: string, role: Role): Observable<User> {
        return this.apiService.post<User>(
            `${this.authBasePath}/admin/users/${userId}/roles/${role}`,
            {}
        );
    }

    /**
     * Remove role from user
     */
    removeRole(userId: string, role: Role): Observable<User> {
        return this.apiService.delete<User>(
            `${this.authBasePath}/admin/users/${userId}/roles/${role}`
        );
    }

    /**
     * Lock user account
     */
    lockUser(userId: string): Observable<void> {
        return this.apiService.post<void>(`${this.authBasePath}/admin/users/${userId}/lock`, {});
    }

    /**
     * Unlock user account
     */
    unlockUser(userId: string): Observable<void> {
        return this.apiService.post<void>(`${this.authBasePath}/admin/users/${userId}/unlock`, {});
    }

    /**
     * Get locked accounts
     */
    getLockedAccounts(): Observable<User[]> {
        return this.apiService.get<User[]>(`${this.authBasePath}/admin/users/locked`);
    }

    /**
     * Deactivate user
     */
    deactivateUser(userId: string): Observable<void> {
        return this.apiService.delete<void>(`${this.authBasePath}/admin/users/${userId}`);
    }

    // ========== AUDIT LOGS ==========

    /**
     * Get audit logs
     */
    getAuditLogs(page: number = 0, size: number = 50): Observable<PagedResponse<AuditLog>> {
        return this.apiService.get<PagedResponse<AuditLog>>(
            `${this.authBasePath}/admin/audit-logs?page=${page}&size=${size}`
        );
    }

    // ========== TECHNICIAN MANAGEMENT (Service Manager) ==========

    /**
     * Get pending technicians (Service Manager)
     * Endpoint: GET /api/service-manager/technicians/pending
     */
    getPendingTechnicians(page: number = 0, size: number = 10): Observable<TechnicianProfile[]> {
        return this.apiService.get<ApiResponse<any>>(`${this.authBasePath}/service-manager/technicians/pending?page=${page}&size=${size}`).pipe(
            map(response => {
                // Handle paginated response - content is the array of technicians
                if (response.data?.content) {
                    return response.data.content;
                }
                return response.data || [];
            })
        );
    }

    /**
     * Approve technician (Service Manager)
     * Endpoint: POST /api/service-manager/technicians/{id}/approve
     */
    approveTechnician(technicianId: string): Observable<TechnicianProfile> {
        return this.apiService.post<ApiResponse<TechnicianProfile>>(
            `${this.authBasePath}/service-manager/technicians/${technicianId}/approve`,
            {}
        ).pipe(
            map(response => response.data)
        );
    }

    /**
     * Reject technician (Service Manager)
     * Endpoint: POST /api/service-manager/technicians/{id}/reject
     */
    rejectTechnician(technicianId: string, reason: string): Observable<TechnicianProfile> {
        return this.apiService.post<ApiResponse<TechnicianProfile>>(
            `${this.authBasePath}/service-manager/technicians/${technicianId}/reject`,
            { reason }
        ).pipe(
            map(response => response.data)
        );
    }

    /**
     * Get all approved technicians (Service Manager)
     * Endpoint: GET /api/service-manager/technicians
     */
    getAllTechnicians(availability?: string, skills?: string[]): Observable<TechnicianProfile[]> {
        let query = '?page=0&size=100';
        if (availability) query += `&availability=${availability}`;
        if (skills && skills.length > 0) {
            query += `&skills=${skills.join(',')}`;
        }
        return this.apiService.get<ApiResponse<any>>(`${this.authBasePath}/service-manager/technicians${query}`).pipe(
            map(response => {
                // Handle paginated response
                if (response.data?.content) {
                    return response.data.content;
                }
                return response.data || [];
            })
        );
    }

    /**
     * Get technician by ID (Service Manager)
     * Endpoint: GET /api/service-manager/technicians/{id}
     */
    getTechnicianById(id: string): Observable<TechnicianProfile> {
        return this.apiService.get<ApiResponse<TechnicianProfile>>(`${this.authBasePath}/service-manager/technicians/${id}`).pipe(
            map(response => response.data)
        );
    }

    /**
     * Get current technician's own profile (Technician role)
     * Endpoint: GET /api/technician/profile
     */
    getMyTechnicianProfile(): Observable<TechnicianProfile> {
        return this.apiService.get<ApiResponse<TechnicianProfile>>(`${this.authBasePath}/technician/profile`).pipe(
            map(response => response.data)
        );
    }

    /**
     * Update technician availability (Technician's own profile)
     * Endpoint: PATCH /api/technician/availability?available=true/false
     */
    updateAvailability(available: boolean): Observable<void> {
        return this.apiService.patch<ApiResponse<void>>(
            `${this.authBasePath}/technician/availability?available=${available}`,
            {}
        ).pipe(
            map(response => response.data)
        );
    }
}

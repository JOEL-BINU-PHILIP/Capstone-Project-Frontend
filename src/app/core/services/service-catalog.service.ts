import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Category,
    Service,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    CreateServiceRequest,
    UpdateServiceRequest
} from '../models';

/**
 * Service Catalog API Service
 */
@Injectable({
    providedIn: 'root'
})
export class ServiceCatalogService {
    private readonly basePath = '/api/services';

    constructor(private readonly apiService: ApiService) { }

    // ========== CATEGORIES ==========

    /**
     * Get all categories (public)
     */
    getCategories(activeOnly: boolean = true): Observable<Category[]> {
        const params = activeOnly ? '?active=true' : '';
        return this.apiService.get<Category[]>(`${this.basePath}/categories${params}`);
    }

    /**
     * Get category by ID
     */
    getCategoryById(id: string): Observable<Category> {
        return this.apiService.get<Category>(`${this.basePath}/categories/${id}`);
    }

    /**
     * Create category (Admin only)
     * Note: Backend returns just the created category ID as plain text
     */
    createCategory(request: CreateCategoryRequest): Observable<string> {
        return this.apiService.postWithTextResponse(`${this.basePath}/categories`, request);
    }

    /**
     * Update category (Admin only)
     */
    updateCategory(id: string, request: UpdateCategoryRequest): Observable<Category> {
        return this.apiService.put<Category>(`${this.basePath}/categories/${id}`, request);
    }

    /**
     * Update category status (Admin only)
     */
    updateCategoryStatus(id: string, active: boolean): Observable<Category> {
        return this.apiService.put<Category>(`${this.basePath}/categories/${id}/status`, { active });
    }

    /**
     * Delete category (Admin only)
     */
    deleteCategory(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/categories/${id}`);
    }

    // ========== SERVICES ==========

    /**
     * Get all services (public)
     */
    getServices(categoryId?: string): Observable<Service[]> {
        const params = categoryId ? `?categoryId=${categoryId}` : '';
        return this.apiService.get<Service[]>(`${this.basePath}${params}`);
    }

    /**
     * Get service by ID
     */
    getServiceById(id: string): Observable<Service> {
        return this.apiService.get<Service>(`${this.basePath}/${id}`);
    }

    /**
     * Search services
     */
    searchServices(query: string): Observable<Service[]> {
        return this.apiService.get<Service[]>(`${this.basePath}/search?query=${encodeURIComponent(query)}`);
    }

    /**
     * Create service (Admin only)
     * Note: Backend returns just the created service ID as plain text
     */
    createService(request: CreateServiceRequest): Observable<string> {
        return this.apiService.postWithTextResponse(this.basePath, request);
    }

    /**
     * Update service (Admin only)
     */
    updateService(id: string, request: UpdateServiceRequest): Observable<Service> {
        return this.apiService.put<Service>(`${this.basePath}/${id}`, request);
    }

    /**
     * Update service status (Admin only)
     * Note: Backend expects 'active' as query parameter
     */
    updateServiceStatus(id: string, active: boolean): Observable<Service> {
        return this.apiService.put<Service>(`${this.basePath}/${id}/status?active=${active}`, {});
    }

    /**
     * Delete service (Admin only)
     */
    deleteService(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/${id}`);
    }
}

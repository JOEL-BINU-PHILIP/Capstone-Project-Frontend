import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Base API service for making HTTP requests
 * All requests are routed through API Gateway
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }

    /**
     * GET request
     */
    get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.get<T>(url, { params });
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.post<T>(url, body, options);
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.put<T>(url, body);
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.patch<T>(url, body);
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.delete<T>(url);
    }

    /**
     * POST request without body (for actions)
     */
    postAction<T>(endpoint: string): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.post<T>(url, {});
    }
}

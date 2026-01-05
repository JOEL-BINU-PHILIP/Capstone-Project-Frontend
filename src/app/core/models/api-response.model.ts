/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp?: string;
}

/**
 * Paginated response
 */
export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

/**
 * Error response
 */
export interface ErrorResponse {
    error: string;
    message: string;
    path: string;
    status: number;
    timestamp: string;
}

import { Injectable } from '@angular/core';

/**
 * Service for managing local storage operations
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /**
     * Set item in localStorage
     */
    setItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to localStorage', error);
        }
    }

    /**
     * Get item from localStorage
     */
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            try {
                return JSON.parse(item);
            } catch {
                // If parsing fails, return the raw value (for backward compatibility with non-JSON stored values)
                return item as T;
            }
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return null;
        }
    }

    /**
     * Remove item from localStorage
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage', error);
        }
    }

    /**
     * Clear all items from localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }

    /**
     * Check if key exists in localStorage
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Set item in sessionStorage
     */
    setSessionItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to sessionStorage', error);
        }
    }

    /**
     * Get item from sessionStorage
     */
    getSessionItem<T>(key: string): T | null {
        try {
            const item = sessionStorage.getItem(key);
            if (!item) return null;

            try {
                return JSON.parse(item);
            } catch {
                // If parsing fails, return the raw value
                return item as T;
            }
        } catch (error) {
            console.error('Error reading from sessionStorage', error);
            return null;
        }
    }

    /**
     * Remove item from sessionStorage
     */
    removeSessionItem(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from sessionStorage', error);
        }
    }

    /**
     * Clear all items from sessionStorage
     */
    clearSession(): void {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error clearing sessionStorage', error);
        }
    }
}

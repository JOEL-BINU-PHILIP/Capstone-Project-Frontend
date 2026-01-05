import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

/**
 * Notification service - Shows toast/snackbar messages
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();
    private nextId = 1;

    /**
     * Show success message
     */
    success(message: string, duration: number = 3000): void {
        this.add({ message, type: 'success' }, duration);
    }

    /**
     * Show error message
     */
    error(message: string, duration: number = 5000): void {
        this.add({ message, type: 'error' }, duration);
    }

    /**
     * Show warning message
     */
    warning(message: string, duration: number = 4000): void {
        this.add({ message, type: 'warning' }, duration);
    }

    /**
     * Show info message
     */
    info(message: string, duration: number = 3000): void {
        this.add({ message, type: 'info' }, duration);
    }

    /**
     * Add notification
     */
    private add(notification: Omit<NotificationMessage, 'id'>, duration: number): void {
        const id = this.nextId++;
        const newNotification: NotificationMessage = { ...notification, id };
        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([...current, newNotification]);

        // Auto remove after duration
        setTimeout(() => this.remove(id), duration);
    }

    /**
     * Remove notification by ID
     */
    remove(id: number): void {
        const current = this.notificationsSubject.value;
        this.notificationsSubject.next(current.filter(n => n.id !== id));
    }
}

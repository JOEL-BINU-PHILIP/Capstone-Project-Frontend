import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Loading service - Manages global loading state
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    private requestCount = 0;

    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor(private readonly ngZone: NgZone) { }

    /**
     * Show loading indicator
     */
    show(): void {
        this.requestCount++;
        if (this.requestCount === 1) {
            // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => this.loadingSubject.next(true), 0);
        }
    }

    /**
     * Hide loading indicator
     */
    hide(): void {
        this.requestCount--;
        if (this.requestCount <= 0) {
            this.requestCount = 0;
            // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => this.loadingSubject.next(false), 0);
        }
    }

    /**
     * Force reset the loading state (useful for error recovery)
     */
    forceHide(): void {
        this.requestCount = 0;
        setTimeout(() => this.loadingSubject.next(false), 0);
    }

    /**
     * Get current loading state
     */
    isLoading(): boolean {
        return this.loadingSubject.value;
    }
}

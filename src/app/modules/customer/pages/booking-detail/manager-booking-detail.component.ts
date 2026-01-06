import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Booking, BookingStatus, TechnicianProfile } from '../../../../core/models';

@Component({
    selector: 'app-manager-booking-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manager-booking-detail.component.html',
    styleUrls: ['./manager-booking-detail.component.css']
})
export class ManagerBookingDetailComponent implements OnInit {
    booking: Booking | null = null;
    availableTechnicians: TechnicianProfile[] = [];
    loading = false;
    showAssignDialog = false;
    showCancelDialog = false;
    selectedTechnicianId = '';
    cancelReason = '';

    BookingStatus = BookingStatus;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly bookingService: BookingService,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadBooking(id);
        }
    }

    loadBooking(id: string): void {
        this.loading = true;
        this.bookingService.getBookingById(id).subscribe({
            next: (booking) => {
                this.booking = booking;
                this.loading = false;
            },
            error: (error) => {
                this.notificationService.error('Failed to load booking details');
                console.error('Error loading booking:', error);
                this.loading = false;
                this.router.navigate(['/manager/bookings']);
            }
        });
    }

    // Check if booking can be assigned/reassigned
    canAssignTechnician(): boolean {
        if (!this.booking) return false;
        return this.booking.status === BookingStatus.PENDING ||
            this.booking.status === BookingStatus.ASSIGNED;
    }

    // Check if booking can be cancelled
    canCancelBooking(): boolean {
        if (!this.booking) return false;
        return this.booking.status !== BookingStatus.COMPLETED &&
            this.booking.status !== BookingStatus.CANCELLED &&
            this.booking.status !== BookingStatus.IN_PROGRESS;
    }

    openAssignDialog(): void {
        this.selectedTechnicianId = '';
        this.showAssignDialog = true;
        this.loadAvailableTechnicians();
    }

    closeAssignDialog(): void {
        this.showAssignDialog = false;
        this.selectedTechnicianId = '';
    }

    loadAvailableTechnicians(): void {
        this.adminService.getAllTechnicians('AVAILABLE').subscribe({
            next: (technicians) => {
                this.availableTechnicians = technicians;
            },
            error: (error) => {
                console.error('Error loading technicians:', error);
                this.notificationService.error('Failed to load available technicians');
            }
        });
    }

    assignTechnician(): void {
        if (!this.booking?.id || !this.selectedTechnicianId) return;

        const request = { technicianId: this.selectedTechnicianId };
        const isReassign = this.booking.status === BookingStatus.ASSIGNED;

        const action$ = isReassign
            ? this.bookingService.reassignTechnician(this.booking.id, request)
            : this.bookingService.assignTechnician(this.booking.id, request);

        action$.subscribe({
            next: (updatedBooking) => {
                this.booking = updatedBooking;
                this.notificationService.success(isReassign ? 'Technician reassigned successfully' : 'Technician assigned successfully');
                this.closeAssignDialog();
                // Reload to get fresh data
                this.loadBooking(this.booking.id);
            },
            error: (error) => {
                console.error('Error assigning technician:', error);
                this.notificationService.error('Failed to assign technician');
            }
        });
    }

    openCancelDialog(): void {
        this.cancelReason = '';
        this.showCancelDialog = true;
    }

    closeCancelDialog(): void {
        this.showCancelDialog = false;
        this.cancelReason = '';
    }

    cancelBooking(): void {
        if (!this.booking?.id || !this.cancelReason.trim()) return;

        this.bookingService.cancelBooking(this.booking.id, this.cancelReason).subscribe({
            next: () => {
                this.notificationService.success('Booking cancelled successfully');
                this.closeCancelDialog();
                this.loadBooking(this.booking!.id);
            },
            error: (error) => {
                console.error('Error cancelling booking:', error);
                this.notificationService.error('Failed to cancel booking');
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/manager/bookings']);
    }

    getStatusClass(status: string): string {
        return 'status-' + status.toLowerCase().replace('_', '-');
    }

    getPriorityClass(priority: string): string {
        return 'priority-' + priority.toLowerCase();
    }
}

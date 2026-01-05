import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TechnicianProfile } from '../../../../core/models';

@Component({
  selector: 'app-pending-technicians',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-technicians.component.html',
  styleUrls: ['./pending-technicians.component.css']
})
export class PendingTechniciansComponent implements OnInit {
  technicians: TechnicianProfile[] = [];
  loading = false;
  showRejectDialog = false;
  selectedTechnician: TechnicianProfile | null = null;
  rejectReason = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadPendingTechnicians();
  }

  loadPendingTechnicians(): void {
    this.loading = true;
    this.adminService.getPendingTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending technicians:', error);
        this.notificationService.error('Failed to load pending technicians');
        this.loading = false;
      }
    });
  }

  approveTechnician(technician: TechnicianProfile): void {
    if (!technician.id) return;

    this.adminService.approveTechnician(technician.id).subscribe({
      next: () => {
        this.notificationService.success('Technician approved successfully');
        this.technicians = this.technicians.filter(t => t.id !== technician.id);
      },
      error: (error) => {
        console.error('Error approving technician:', error);
        this.notificationService.error('Failed to approve technician');
      }
    });
  }

  openRejectDialog(technician: TechnicianProfile): void {
    this.selectedTechnician = technician;
    this.rejectReason = '';
    this.showRejectDialog = true;
  }

  closeRejectDialog(): void {
    this.showRejectDialog = false;
    this.selectedTechnician = null;
    this.rejectReason = '';
  }

  confirmReject(): void {
    if (!this.selectedTechnician?.id || !this.rejectReason.trim()) return;

    this.adminService.rejectTechnician(this.selectedTechnician.id, this.rejectReason).subscribe({
      next: () => {
        this.notificationService.success('Technician application rejected');
        this.technicians = this.technicians.filter(t => t.id !== this.selectedTechnician?.id);
        this.closeRejectDialog();
      },
      error: (error) => {
        console.error('Error rejecting technician:', error);
        this.notificationService.error('Failed to reject technician');
      }
    });
  }
}

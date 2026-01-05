import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TechnicianProfile } from '../../../../core/models';

@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technician-profile.component.html',
  styleUrls: ['./technician-profile.component.css']
})
export class TechnicianProfileComponent implements OnInit {
  user: any = null;
  profile: TechnicianProfile | null = null;
  newSkill = '';

  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // Use technician's own profile endpoint
    this.adminService.getMyTechnicianProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.notificationService.error('Failed to load profile');
      }
    });
  }

  toggleAvailability(): void {
    if (!this.profile) return;

    // Use boolean for availability - backend expects ?available=true/false
    const currentlyAvailable = this.profile.available === true;
    this.adminService.updateAvailability(!currentlyAvailable).subscribe({
      next: () => {
        // Reload profile to get updated state
        this.adminService.getMyTechnicianProfile().subscribe({
          next: (profile) => {
            this.profile = profile;
            this.notificationService.success(`Availability updated`);
          }
        });
      },
      error: (error) => {
        console.error('Error updating availability:', error);
        this.notificationService.error('Failed to update availability');
      }
    });
  }

  addSkill(): void {
    if (!this.newSkill.trim() || !this.profile) return;

    // Add skill to profile (this would require a backend endpoint)
    // For now, just update locally
    if (this.profile.skills.includes(this.newSkill.trim())) {
      this.notificationService.warning('Skill already exists');
    } else {
      this.profile.skills.push(this.newSkill.trim());
      this.notificationService.success('Skill added successfully');
      this.newSkill = '';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User, Role } from '../../../../core/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  roleFilter = '';
  statusFilter = '';
  showRoleDialog = false;
  selectedUser: User | null = null;
  newRole = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  hasRole(role: string): boolean {
    if (!this.selectedUser || !role) return false;
    return this.selectedUser.roles.includes(role as Role);
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers(0, 1000).subscribe({
      next: (response) => {
        const data = (response as any).data || response;
        this.users = data.content || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.error('Failed to load users');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      if (this.roleFilter && !user.roles.includes(this.roleFilter as Role)) {
        return false;
      }
      if (this.statusFilter === 'locked' && !user.accountLocked) {
        return false;
      }
      if (this.statusFilter === 'active' && user.accountLocked) {
        return false;
      }
      return true;
    });
  }

  lockUser(user: User): void {
    if (!user.id) return;

    this.adminService.lockUser(user.id).subscribe({
      next: () => {
        user.accountLocked = true;
        this.notificationService.success('User locked successfully');
      },
      error: (error) => {
        console.error('Error locking user:', error);
        this.notificationService.error('Failed to lock user');
      }
    });
  }

  unlockUser(user: User): void {
    if (!user.id) return;

    this.adminService.unlockUser(user.id).subscribe({
      next: () => {
        user.accountLocked = false;
        this.notificationService.success('User unlocked successfully');
      },
      error: (error) => {
        console.error('Error unlocking user:', error);
        this.notificationService.error('Failed to unlock user');
      }
    });
  }

  openRoleDialog(user: User): void {
    this.selectedUser = user;
    this.newRole = '';
    this.showRoleDialog = true;
  }

  closeRoleDialog(): void {
    this.showRoleDialog = false;
    this.selectedUser = null;
    this.newRole = '';
  }

  addRole(): void {
    if (!this.selectedUser?.id || !this.newRole) return;

    this.adminService.assignRole(this.selectedUser.id, this.newRole as Role).subscribe({
      next: (updatedUser) => {
        if (this.selectedUser) {
          this.selectedUser.roles = updatedUser.roles;
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
        }
        this.notificationService.success('Role added successfully');
        this.newRole = '';
      },
      error: (error) => {
        console.error('Error adding role:', error);
        this.notificationService.error('Failed to add role');
      }
    });
  }

  removeRole(role: string): void {
    if (!this.selectedUser?.id) return;

    this.adminService.removeRole(this.selectedUser.id, role as Role).subscribe({
      next: (updatedUser) => {
        if (this.selectedUser) {
          this.selectedUser.roles = updatedUser.roles;
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
        }
        this.notificationService.success('Role removed successfully');
      },
      error: (error) => {
        console.error('Error removing role:', error);
        this.notificationService.error('Failed to remove role');
      }
    });
  }
}

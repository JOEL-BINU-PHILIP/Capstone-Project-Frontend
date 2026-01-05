import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { TechnicianProfile } from '../../../../core/models';

@Component({
  selector: 'app-all-technicians',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-technicians.component.html',
  styleUrls: ['./all-technicians.component.css']
})
export class AllTechniciansComponent implements OnInit {
  technicians: TechnicianProfile[] = [];
  filteredTechnicians: TechnicianProfile[] = [];
  loading = false;
  availabilityFilter = '';

  constructor(private readonly adminService: AdminService) { }

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.loading = true;
    this.adminService.getAllTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTechnicians = this.technicians.filter(tech => {
      if (this.availabilityFilter) {
        // Handle boolean 'available' field from backend
        if (tech.available !== undefined) {
          const isAvailable = tech.available === true;
          if (this.availabilityFilter === 'AVAILABLE' && !isAvailable) return false;
          if (this.availabilityFilter === 'UNAVAILABLE' && isAvailable) return false;
        } else if (tech.availability?.toUpperCase() !== this.availabilityFilter) {
          return false;
        }
      }
      return true;
    });
  }
}

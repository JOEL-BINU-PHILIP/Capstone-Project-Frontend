import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ServiceCatalogService } from '../../../../core/services/service-catalog.service';
import { Category, Service } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  categories: Category[] = [];
  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedCategoryId: string | null = null;

  constructor(
    private readonly serviceCatalogService: ServiceCatalogService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadServices();
  }

  loadCategories(): void {
    this.serviceCatalogService.getCategories(true).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        this.notificationService.error('Failed to load categories');
        console.error('Error loading categories:', error);
      }
    });
  }

  loadServices(): void {
    this.serviceCatalogService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.filteredServices = services;
      },
      error: (error) => {
        this.notificationService.error('Failed to load services');
        console.error('Error loading services:', error);
      }
    });
  }

  selectCategory(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    if (categoryId) {
      this.filteredServices = this.services.filter(s => s.categoryId === categoryId);
    } else {
      this.filteredServices = this.services;
    }
  }

  bookService(serviceId: string): void {
    this.router.navigate(['/customer/booking/create'], { queryParams: { serviceId } });
  }
}

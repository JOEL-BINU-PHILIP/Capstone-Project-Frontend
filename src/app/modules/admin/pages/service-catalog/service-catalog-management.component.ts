import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCatalogService } from '../../../../core/services/service-catalog.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category, Service } from '../../../../core/models';

@Component({
  selector: 'app-service-catalog-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-catalog-management.component.html',
  styleUrls: ['./service-catalog-management.component.css']
})
export class ServiceCatalogManagementComponent implements OnInit {
  categories: Category[] = [];
  services: Service[] = [];
  showCategoryDialog = false;
  showServiceDialog = false;
  editingCategory: Category | null = null;
  editingService: Service | null = null;

  categoryForm: any = {
    name: '',
    description: '',
    imageUrl: ''
  };

  serviceForm: any = {
    name: '',
    description: '',
    categoryId: '',
    basePrice: 0,
    estimatedDuration: 60,
    imageUrl: '',
    active: true
  };

  constructor(
    private readonly serviceCatalogService: ServiceCatalogService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadServices();
  }

  loadCategories(): void {
    this.serviceCatalogService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.error('Failed to load categories');
      }
    });
  }

  loadServices(): void {
    this.serviceCatalogService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.notificationService.error('Failed to load services');
      }
    });
  }

  // Category Methods
  openCategoryDialog(): void {
    this.editingCategory = null;
    this.categoryForm = { name: '', description: '', imageUrl: '' };
    this.showCategoryDialog = true;
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm = { ...category };
    this.showCategoryDialog = true;
  }

  closeCategoryDialog(): void {
    this.showCategoryDialog = false;
    this.editingCategory = null;
  }

  saveCategory(): void {
    if (!this.categoryForm.name || !this.categoryForm.description) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    if (this.editingCategory?.id) {
      this.serviceCatalogService.updateCategory(this.editingCategory.id, this.categoryForm).subscribe({
        next: () => {
          this.notificationService.success('Category updated successfully');
          this.loadCategories();
          this.closeCategoryDialog();
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.notificationService.error('Failed to update category');
        }
      });
    } else {
      this.serviceCatalogService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.notificationService.success('Category created successfully');
          this.loadCategories();
          this.closeCategoryDialog();
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.notificationService.error('Failed to create category');
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (!category.id) return;

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    this.serviceCatalogService.deleteCategory(category.id).subscribe({
      next: () => {
        this.notificationService.success('Category deleted successfully');
        this.loadCategories();
        this.loadServices();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.notificationService.error('Failed to delete category');
      }
    });
  }

  // Service Methods
  openServiceDialog(): void {
    this.editingService = null;
    this.serviceForm = {
      name: '',
      description: '',
      categoryId: '',
      basePrice: 0,
      estimatedDuration: 60,
      imageUrl: '',
      active: true
    };
    this.showServiceDialog = true;
  }

  editService(service: Service): void {
    this.editingService = service;
    this.serviceForm = { ...service };
    this.showServiceDialog = true;
  }

  closeServiceDialog(): void {
    this.showServiceDialog = false;
    this.editingService = null;
  }

  saveService(): void {
    if (!this.serviceForm.name || !this.serviceForm.categoryId || !this.serviceForm.basePrice) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    if (this.editingService?.id) {
      this.serviceCatalogService.updateService(this.editingService.id, this.serviceForm).subscribe({
        next: () => {
          this.notificationService.success('Service updated successfully');
          this.loadServices();
          this.closeServiceDialog();
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.notificationService.error('Failed to update service');
        }
      });
    } else {
      this.serviceCatalogService.createService(this.serviceForm).subscribe({
        next: () => {
          this.notificationService.success('Service created successfully');
          this.loadServices();
          this.closeServiceDialog();
        },
        error: (error) => {
          console.error('Error creating service:', error);
          this.notificationService.error('Failed to create service');
        }
      });
    }
  }

  deleteService(service: Service): void {
    if (!service.id) return;

    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) return;

    this.serviceCatalogService.deleteService(service.id).subscribe({
      next: () => {
        this.notificationService.success('Service deleted successfully');
        this.loadServices();
      },
      error: (error) => {
        console.error('Error deleting service:', error);
        this.notificationService.error('Failed to delete service');
      }
    });
  }
}

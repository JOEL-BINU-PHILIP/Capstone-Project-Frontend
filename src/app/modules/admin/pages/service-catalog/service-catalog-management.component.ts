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
  showDeleteConfirm = false;
  editingCategory: Category | null = null;
  editingService: Service | null = null;
  deleteTarget: { type: 'category' | 'service'; item: Category | Service } | null = null;

  categoryForm: any = {
    name: '',
    description: '',
    iconUrl: '',
    displayOrder: 1
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
    // Set displayOrder to next available order
    const maxOrder = this.categories.length > 0
      ? Math.max(...this.categories.map(c => c.displayOrder || 0))
      : 0;
    this.categoryForm = { name: '', description: '', iconUrl: '', displayOrder: maxOrder + 1 };
    this.showCategoryDialog = true;
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description,
      iconUrl: category.iconUrl || '',
      displayOrder: category.displayOrder || 1
    };
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
    this.deleteTarget = { type: 'category', item: category };
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (!this.deleteTarget) return;

    if (this.deleteTarget.type === 'category') {
      const category = this.deleteTarget.item as Category;
      this.serviceCatalogService.deleteCategory(category.id!).subscribe({
        next: () => {
          this.notificationService.success('Category deleted successfully');
          this.loadCategories();
          this.loadServices();
          this.closeDeleteConfirm();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.notificationService.error('Failed to delete category');
          this.closeDeleteConfirm();
        }
      });
    } else {
      const service = this.deleteTarget.item as Service;
      this.serviceCatalogService.deleteService(service.id!).subscribe({
        next: () => {
          this.notificationService.success('Service deleted successfully');
          this.loadServices();
          this.closeDeleteConfirm();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.notificationService.error('Failed to delete service');
          this.closeDeleteConfirm();
        }
      });
    }
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
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
      // When editing, check if status changed
      const statusChanged = this.editingService.active !== this.serviceForm.active;

      // Prepare update request (without 'active' field as backend doesn't accept it)
      const updateRequest = {
        name: this.serviceForm.name,
        description: this.serviceForm.description,
        categoryId: this.serviceForm.categoryId,
        basePrice: this.serviceForm.basePrice,
        estimatedDuration: this.serviceForm.estimatedDuration,
        imageUrl: this.serviceForm.imageUrl
      };

      // Update service details first
      this.serviceCatalogService.updateService(this.editingService.id, updateRequest).subscribe({
        next: () => {
          // If status changed, update it separately
          if (statusChanged && this.editingService?.id) {
            this.serviceCatalogService.updateServiceStatus(this.editingService.id, this.serviceForm.active).subscribe({
              next: () => {
                this.notificationService.success('Service updated successfully');
                this.loadServices();
                this.closeServiceDialog();
              },
              error: (error) => {
                console.error('Error updating service status:', error);
                this.notificationService.error('Failed to update service status');
              }
            });
          } else {
            this.notificationService.success('Service updated successfully');
            this.loadServices();
            this.closeServiceDialog();
          }
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.notificationService.error('Failed to update service');
        }
      });
    } else {
      // Create new service (without 'active' - new services are active by default)
      const createRequest = {
        name: this.serviceForm.name,
        description: this.serviceForm.description,
        categoryId: this.serviceForm.categoryId,
        basePrice: this.serviceForm.basePrice,
        estimatedDuration: this.serviceForm.estimatedDuration,
        imageUrl: this.serviceForm.imageUrl
      };

      this.serviceCatalogService.createService(createRequest).subscribe({
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
    this.deleteTarget = { type: 'service', item: service };
    this.showDeleteConfirm = true;
  }
}

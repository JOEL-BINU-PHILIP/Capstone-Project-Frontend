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
  selectedCategoryName: string = 'All Services';

  // Fallback icons for categories
  private readonly categoryIcons: { [key: string]: string } = {
    'ac services': '❄️',
    'plumbing': '🔧',
    'electrical': '⚡',
    'home cleaning': '🧹',
    'appliance repair': '🔌',
    'carpentry': '🪚',
    'painting': '🎨',
    'pest control': '🐛',
    'water purifier': '💧',
    'home automation': '🏠',
    'default': '🛠️'
  };

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
      const category = this.categories.find(c => c.id === categoryId);
      this.selectedCategoryName = category?.name || 'Category';
      this.filteredServices = this.services.filter(s => s.categoryId === categoryId);
    } else {
      this.selectedCategoryName = 'All Services';
      this.filteredServices = this.services;
    }
  }

  bookService(serviceId: string): void {
    this.router.navigate(['/customer/booking/create'], { queryParams: { serviceId } });
  }

  /**
   * Get icon for a category - uses emoji fallback if no valid iconUrl
   */
  getCategoryIcon(category: Category): string {
    const name = category.name.toLowerCase();
    return this.categoryIcons[name] || this.categoryIcons['default'];
  }

  /**
   * Handle image load error - replace with placeholder
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
        <rect fill="#f3f4f6" width="300" height="200"/>
        <text x="150" y="100" font-family="Arial" font-size="48" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">🛠️</text>
        <text x="150" y="140" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle">Service Image</text>
      </svg>
    `);
  }
}

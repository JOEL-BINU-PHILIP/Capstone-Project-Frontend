import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceCatalogService } from '../../../../core/services/service-catalog.service';
import { Category, Service } from '../../../../core/models';

@Component({
  selector: 'app-services-browse',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './services-browse.component.html',
  styleUrls: ['./services-browse.component.css']
})
export class ServicesBrowseComponent implements OnInit {
  categories: Category[] = [];
  services: Service[] = [];
  filteredServices: Service[] = [];

  selectedCategoryId: string = '';
  searchQuery: string = '';
  isLoading = true;
  error: string = '';

  constructor(private readonly serviceCatalogService: ServiceCatalogService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Load categories
    this.serviceCatalogService.getCategories(true).subscribe({
      next: (response: any) => {
        this.categories = response.data || response || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    // Load all services
    this.serviceCatalogService.getServices().subscribe({
      next: (response: any) => {
        this.services = response.data || response || [];
        this.filteredServices = this.services;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.error = 'Failed to load services. Please try again.';
        this.isLoading = false;
      }
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.services];

    // Filter by category
    if (this.selectedCategoryId) {
      filtered = filtered.filter(s => s.categoryId === this.selectedCategoryId);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.categoryName?.toLowerCase().includes(query)
      );
    }

    this.filteredServices = filtered;
  }

  clearFilters(): void {
    this.selectedCategoryId = '';
    this.searchQuery = '';
    this.filteredServices = this.services;
  }

  getCategoryIcon(category: Category): string {
    // Return emoji based on category name
    const icons: { [key: string]: string } = {
      'cleaning': '🧹',
      'plumbing': '🔧',
      'electrical': '⚡',
      'painting': '🎨',
      'carpentry': '🪚',
      'appliance': '🔌',
      'pest control': '🐛',
      'ac': '❄️',
      'gardening': '🌱',
      'moving': '📦'
    };

    const name = category.name.toLowerCase();
    for (const key of Object.keys(icons)) {
      if (name.includes(key)) return icons[key];
    }
    return '🛠️';
  }
}

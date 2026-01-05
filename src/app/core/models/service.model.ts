/**
 * Service category
 */
export interface Category {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
    active: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Service
 */
export interface Service {
    id: string;
    categoryId: string;
    categoryName: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl?: string;
    active: boolean;
    estimatedDuration?: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create category request
 */
export interface CreateCategoryRequest {
    name: string;
    description: string;
    iconUrl?: string;
    displayOrder: number;
}

/**
 * Update category request
 */
export interface UpdateCategoryRequest {
    name: string;
    description: string;
    iconUrl?: string;
    displayOrder: number;
}

/**
 * Create service request
 */
export interface CreateServiceRequest {
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl?: string;
    estimatedDuration?: number;
}

/**
 * Update service request
 */
export interface UpdateServiceRequest {
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl?: string;
    estimatedDuration?: number;
}

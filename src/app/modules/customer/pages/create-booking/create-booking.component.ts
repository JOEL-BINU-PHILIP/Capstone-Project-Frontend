import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { ServiceCatalogService } from '../../../../core/services/service-catalog.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Service, CreateBookingRequest, BookingPriority } from '../../../../core/models';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {
  bookingForm: FormGroup;
  services: Service[] = [];
  selectedService: Service | null = null;
  isSubmitting = false;
  minDateTime: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookingService: BookingService,
    private readonly serviceCatalogService: ServiceCatalogService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      serviceId: ['', Validators.required],
      problemDescription: ['', [Validators.required, Validators.minLength(10)]],
      scheduledDate: ['', Validators.required],
      priority: ['NORMAL', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      specialInstructions: ['']
    });
  }

  ngOnInit(): void {
    this.setMinDateTime();
    this.loadServices();
    this.prefillUserAddress();

    // Pre-select service if provided in query params
    this.route.queryParams.subscribe(params => {
      if (params['serviceId']) {
        this.bookingForm.patchValue({ serviceId: params['serviceId'] });
      }
    });

    // Update selected service when form changes
    this.bookingForm.get('serviceId')?.valueChanges.subscribe(serviceId => {
      this.selectedService = this.services.find(s => s.id === serviceId) || null;
    });
  }

  /**
   * Pre-fill address fields from current user's registered address
   */
  private prefillUserAddress(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.bookingForm.patchValue({
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || ''
        });
      }
    });
  }

  loadServices(): void {
    this.serviceCatalogService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        // Update selected service if already set
        const serviceId = this.bookingForm.get('serviceId')?.value;
        if (serviceId) {
          this.selectedService = services.find(s => s.id === serviceId) || null;
        }
      },
      error: (error) => {
        this.notificationService.error('Failed to load services');
        console.error('Error loading services:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const request: CreateBookingRequest = {
        ...this.bookingForm.value,
        priority: this.bookingForm.value.priority as BookingPriority
      };

      this.bookingService.createBooking(request).subscribe({
        next: (booking) => {
          this.isSubmitting = false;
          this.notificationService.success('Booking created successfully!');
          // Navigate to bookings list if booking.id is not available
          if (booking?.id) {
            this.router.navigate(['/customer/bookings', booking.id]);
          } else {
            this.router.navigate(['/customer/bookings']);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating booking:', error);

          // Check if this is actually a success (HTTP 201 Created)
          if (error.status === 201 || error.status === 200) {
            this.notificationService.success('Booking created successfully!');
            this.router.navigate(['/customer/bookings']);
            return;
          }

          const message = error.error?.message || error.userMessage || 'Failed to create booking';
          this.notificationService.error(message);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/customer/services']);
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if a field has a specific error
   */
  hasError(field: string, error: string): boolean {
    const control = this.bookingForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  /**
   * Check if a field is invalid and touched
   */
  isInvalid(field: string): boolean {
    const control = this.bookingForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Set minimum date-time to current date-time (prevent past dates)
   */
  private setMinDateTime(): void {
    const now = new Date();
    // Format: YYYY-MM-DDTHH:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}

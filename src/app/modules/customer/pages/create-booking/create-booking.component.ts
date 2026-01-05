import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { ServiceCatalogService } from '../../../../core/services/service-catalog.service';
import { NotificationService } from '../../../../core/services/notification.service';
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookingService: BookingService,
    private readonly serviceCatalogService: ServiceCatalogService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      serviceId: ['', Validators.required],
      problemDescription: ['', [Validators.required, Validators.minLength(10)]],
      scheduledDate: ['', Validators.required],
      priority: ['MEDIUM', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      specialInstructions: ['']
    });
  }

  ngOnInit(): void {
    this.loadServices();

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
          this.notificationService.success('Booking created successfully!');
          this.router.navigate(['/customer/bookings', booking.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.error('Failed to create booking');
          console.error('Error creating booking:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/customer/services']);
  }
}

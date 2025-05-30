import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ServiceSummary } from '../../../models/service-summary.model';
import { CreateServiceDto } from '../../../models/create-service.model';
import { UpdateServiceDto } from '../../../models/update-service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './service-list.html',
  styleUrls: [ '../service-manage-resources/service-manage-resources.css', './service-list.css' ],
})
export class ServiceList implements OnInit {
  services: ServiceSummary[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  editingServiceId: string | null = null;
  serviceNameEditForm!: FormGroup;
  isSubmittingEdit = false;

  isAddingService = false;
  addServiceForm!: FormGroup;
  isSubmittingAdd = false;

  private deletingFlags: { [id: string]: boolean } = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addServiceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
    this.serviceNameEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.apiService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load services.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  startAddService(): void {
    this.isAddingService = true;
    this.addServiceForm.reset();
    this.editingServiceId = null;
    this.errorMessage = null;
  }

  cancelAddService(): void {
    this.isAddingService = false;
    this.addServiceForm.reset();
  }

  saveNewService(): void {
    if (this.addServiceForm.invalid) {
      this.addServiceForm.markAllAsTouched();
      this.errorMessage = "Service name is invalid.";
      return;
    }
    this.isSubmittingAdd = true;
    this.errorMessage = null;
    const payload: CreateServiceDto = { name: this.addServiceForm.value.name };

    this.apiService.createService(payload).subscribe({
      next: (createdService) => {
        alert(`Service "${createdService.name}" created successfully! ID: ${createdService.id}.`);
        this.loadServices();
        this.cancelAddService();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create service.';
      },
      complete: () => this.isSubmittingAdd = false
    });
  }


  startEditServiceName(service: ServiceSummary): void {
    this.editingServiceId = service.id;
    this.serviceNameEditForm.setValue({ name: service.name });
    this.isAddingService = false;
    this.errorMessage = null;
  }

  cancelEditServiceName(): void {
    this.editingServiceId = null;
    this.serviceNameEditForm.reset();
  }

  saveServiceName(originalService: ServiceSummary): void {
    if (this.serviceNameEditForm.invalid || !this.editingServiceId) {
      this.serviceNameEditForm.markAllAsTouched();
      this.errorMessage = "Service name is invalid for update.";
      return;
    }
    this.isSubmittingEdit = true;
    this.errorMessage = null;
    const payload: UpdateServiceDto = {
      name: this.serviceNameEditForm.value.name,
      version: originalService.version
    };

    this.apiService.updateService(this.editingServiceId, payload).subscribe({
      next: (updatedServiceData: ServiceSummary) => {
        const index = this.services.findIndex(s => s.id === this.editingServiceId);
        if (index !== -1) {
          this.services[index] = {
            id: updatedServiceData.id,
            name: updatedServiceData.name,
            version: updatedServiceData.version
          };
        }
        alert(`Service "${updatedServiceData.name}" updated successfully!`);
        this.cancelEditServiceName();
      },
      error: (err) => {
        this.errorMessage = err.message || `Failed to update service ${originalService.name}.`;
        if (err.message && (err.message.toLowerCase().includes('conflict'))) {
          alert("Conflict: This service was modified. Refreshing list.");
          this.loadServices();
        }
        this.cancelEditServiceName();
      },
      complete: () => this.isSubmittingEdit = false
    });
  }

  manageResources(serviceId: string): void {
    this.router.navigate(['/services', serviceId, 'manage-resources']);
  }

  confirmDelete(serviceId: string): void {
    if (!serviceId) { return; }
    if (confirm(`Are you sure you want to delete service ID: ${serviceId}?`)) {
      this.isDeleting(serviceId, true);
      this.apiService.deleteService(serviceId).subscribe({
        next: () => {
          alert('Service deleted successfully!');
          this.loadServices();
        },
        error: (err) => {
          this.errorMessage = err.message || `Failed to delete service ${serviceId}.`;
          this.isDeleting(serviceId, false);
        }
      });
    }
  }

  public isDeleting(serviceId: string, state?: boolean): boolean {
    if (typeof state !== 'undefined') { this.deletingFlags[serviceId] = state; }
    return this.deletingFlags[serviceId] || false;
  }
}

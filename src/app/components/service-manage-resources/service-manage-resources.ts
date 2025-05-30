import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ServiceSummary } from '../../../models/service-summary.model';
import { ResourceSummary } from '../../../models/resource-summary.model';
import { CreateResourceDto } from '../../../models/create-resource.model';
import {UpdateResourceDto} from "../../../models/update-resource.model";

@Component({
  selector: 'app-service-manage-resources',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './service-manage-resources.html',
  styleUrls: ['./service-manage-resources.css']
})
export class ServiceManageResources implements OnInit {
  @Input() serviceId!: string;

  parentService: Partial<ServiceSummary> | null = null;
  resources: ResourceSummary[] = [];

  isLoadingService = true;
  isLoadingResources = true;
  serviceErrorMessage: string | null = null;
  resourcesErrorMessage: string | null = null;

  isAddingResource = false;
  addResourceForm!: FormGroup;
  isSubmittingAddResource = false;

  editingResourceId: string | null = null;
  editResourceForm!: FormGroup;
  isSubmittingEditResource = false;

  private deletingResourceFlags: { [id: string]: boolean } = {};

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private apiService: ApiService,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.serviceId) {
      const routeId = this.route.snapshot.paramMap.get('serviceId');
      if (routeId) {
        this.serviceId = routeId;
      } else {
        this.serviceErrorMessage = "Service ID not found in route.";
        this.isLoadingService = false;
        this.isLoadingResources = false;
        return;
      }
    }

    this.addResourceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    this.editResourceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    this.loadParentServiceDetails();
    this.loadResources();
  }

  loadParentServiceDetails(): void {
    this.isLoadingService = true;
    this.serviceErrorMessage = null;
    this.apiService.getServiceById(this.serviceId).subscribe({
      next: (serviceData) => {
        this.parentService = { id: serviceData.id, name: serviceData.name };
        this.isLoadingService = false;
      },
      error: (err) => {
        this.serviceErrorMessage = err.message || 'Failed to load parent service details.';
        this.isLoadingService = false;
      }
    });
  }

  loadResources(): void {
    this.isLoadingResources = true;
    this.resourcesErrorMessage = null;
    this.apiService.getResourcesForService(this.serviceId).subscribe({
      next: (data) => {
        this.resources = data;
        this.isLoadingResources = false;
      },
      error: (err) => {
        this.resourcesErrorMessage = err.message || 'Failed to load resources.';
        this.isLoadingResources = false;
      }
    });
  }

  startAddResource(): void {
    this.isAddingResource = true;
    this.addResourceForm.reset();
    this.editingResourceId = null;
    this.resourcesErrorMessage = null;
  }

  cancelAddResource(): void {
    this.isAddingResource = false;
  }

  saveNewResource(): void {
    if (this.addResourceForm.invalid) {
      this.addResourceForm.markAllAsTouched();
      this.resourcesErrorMessage = "Resource name is invalid.";
      return;
    }
    if (!this.serviceId) {
      this.resourcesErrorMessage = "Parent Service ID is missing.";
      return;
    }

    this.isSubmittingAddResource = true;
    this.resourcesErrorMessage = null;
    const payload: CreateResourceDto = { name: this.addResourceForm.value.name };

    this.apiService.createResource(this.serviceId, payload).subscribe({
      next: () => {
        this.loadResources();
        this.cancelAddResource();
      },
      error: (err) => { this.resourcesErrorMessage = err.message || 'Failed to add resource.'; },
      complete: () => this.isSubmittingAddResource = false
    });
  }
  startEditResourceName(resource: ResourceSummary): void {
    this.editingResourceId = resource.id;
    this.editResourceForm.setValue({ name: resource.name });
    this.isAddingResource = false;
    this.resourcesErrorMessage = null;
  }

  cancelEditResourceName(): void {
    this.editingResourceId = null;
    this.editResourceForm.reset();
  }

  saveResourceName(): void {
    if (this.editResourceForm.invalid || !this.editingResourceId) {
      this.editResourceForm.markAllAsTouched();
      this.resourcesErrorMessage = "Resource name is invalid for update.";
      return;
    }

    this.isSubmittingEditResource = true;
    this.resourcesErrorMessage = null;
    const payload: UpdateResourceDto = { name: this.editResourceForm.value.name };

    this.apiService.updateResource(this.editingResourceId, this.serviceId, payload).subscribe({
      next: (updatedResource) => {
        this.loadResources();
        this.cancelEditResourceName();
      },
      error: (err) => {
        this.resourcesErrorMessage = err.message || 'Failed to update resource name.';
      },
      complete: () => {
        this.isSubmittingEditResource = false;
      }
    });
  }


  deleteResource(resourceId: string, resourceName: string): void {
    if (!resourceId) {
      this.resourcesErrorMessage = "Resource ID is missing, cannot delete.";
      return;
    }
    if (confirm(`Are you sure you want to delete resource "${resourceName || 'this resource'}" (ID: ${resourceId})? This action cannot be undone.`)) {
      this.isDeletingResource(resourceId, true);
      this.resourcesErrorMessage = null;

      this.apiService.deleteResource(resourceId, this.serviceId).subscribe({
        next: () => {
          this.loadResources();
        },
        error: (err) => {
          this.resourcesErrorMessage = err.message || `Failed to delete resource ${resourceName}.`;
          console.error(`Error deleting resource ${resourceId}:`, err);
          this.isDeletingResource(resourceId, false);
        }
      });
    }
  }

  public isDeletingResource(resourceId: string, state?: boolean): boolean {
    if (typeof state !== 'undefined') {
      this.deletingResourceFlags[resourceId] = state;
    }
    return this.deletingResourceFlags[resourceId] || false;
  }


  manageOwners(resourceId: string, resourceName: string): void {
    alert(`Placeholder: Manage Owners for Resource: "${resourceName}" (ID: ${resourceId})`);
  }

  goBackToServiceList(): void {
    this.router.navigate(['/manage-services']);
  }
}

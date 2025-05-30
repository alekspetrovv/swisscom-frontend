import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ServiceSummary } from '../../../models/service-summary.model';
import { ResourceSummary } from '../../../models/resource-summary.model';
import { OwnerSummary } from '../../../models/owner-summary.model';
import { CreateOwnerDto } from '../../../models/create-owner.model';
import { UpdateOwnerDto } from '../../../models/update-owner.model';

@Component({
  selector: 'app-resource-manage-owners',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resource-manage-owners.html',
  styleUrls: ['../service-manage-resources/service-manage-resources.css','./resource-manage-owners.css']
})
export class ResourceManageOwners implements OnInit {
  @Input() serviceId!: string;
  @Input() resourceId!: string;

  parentService: Partial<ServiceSummary> | null = null;
  parentResource: Partial<ResourceSummary> | null = null;
  owners: OwnerSummary[] = [];

  isLoadingParentService = true;
  isLoadingParentResource = true;
  isLoadingOwners = true;
  parentDataErrorMessage: string | null = null;
  ownersErrorMessage: string | null = null;

  isAddingOwner = false;
  addOwnerForm!: FormGroup;
  isSubmittingAddOwner = false;

  editingOwnerId: string | null = null;
  editOwnerForm!: FormGroup;
  isSubmittingEditOwner = false;

  private deletingOwnerFlags: { [id: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const sIdFromRoute = this.route.snapshot.paramMap.get('serviceId');
    const rIdFromRoute = this.route.snapshot.paramMap.get('resourceId');

    if (sIdFromRoute) this.serviceId = sIdFromRoute;
    if (rIdFromRoute) this.resourceId = rIdFromRoute;

    if (!this.serviceId || !this.resourceId) {
      this.parentDataErrorMessage = "Service ID or Resource ID not found in route.";
      this.isLoadingParentService = false;
      this.isLoadingParentResource = false;
      this.isLoadingOwners = false;
      return;
    }

    this.addOwnerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      accountNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      level: [null, [Validators.required, Validators.min(1)]]
    });

    this.editOwnerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      accountNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      level: [null, [Validators.required, Validators.min(1)]]
    });

    this.loadParentServiceDetails();
    this.loadParentResourceDetails();
    this.loadOwners();
  }

  loadParentServiceDetails(): void {
    this.isLoadingParentService = true;
    this.parentDataErrorMessage = null;
    this.apiService.getServiceById(this.serviceId).subscribe({
      next: (serviceData) => {
        this.parentService = { id: serviceData.id, name: serviceData.name };
        this.isLoadingParentService = false;
      },
      error: (err) => {
        this.parentDataErrorMessage = `Failed to load service: ${err.message}`;
        this.isLoadingParentService = false;
      }
    });
  }

  loadParentResourceDetails(): void {
    this.isLoadingParentResource = true;
    this.apiService.getResourceById(this.serviceId, this.resourceId).subscribe({
      next: (resourceData) => {
        this.parentResource = { id: resourceData.id, name: resourceData.name };
        this.isLoadingParentResource = false;
      },
      error: (err) => {
        this.parentDataErrorMessage = (this.parentDataErrorMessage ? this.parentDataErrorMessage + '\n' : '') +
          `Failed to load resource: ${err.message}`;
        this.isLoadingParentResource = false;
      }
    });
  }

  loadOwners(): void {
    this.isLoadingOwners = true;
    this.ownersErrorMessage = null;
    this.apiService.getOwnersForResource(this.serviceId, this.resourceId).subscribe({
      next: (data) => {
        this.owners = data;
        this.isLoadingOwners = false;
      },
      error: (err) => {
        this.ownersErrorMessage = err.message || 'Failed to load owners.';
        this.isLoadingOwners = false;
      }
    });
  }

  startAddOwner(): void {
    this.isAddingOwner = true;
    this.addOwnerForm.reset();
    this.editingOwnerId = null;
    this.ownersErrorMessage = null;
  }

  cancelAddOwner(): void {
    this.isAddingOwner = false;
    this.addOwnerForm.reset();
  }

  saveNewOwner(): void {
    if (this.addOwnerForm.invalid) {
      this.addOwnerForm.markAllAsTouched();
      this.ownersErrorMessage = "Owner details are invalid. Please correct them.";
      return;
    }
    if (!this.serviceId || !this.resourceId) {
      this.ownersErrorMessage = "Parent Service or Resource ID is missing.";
      return;
    }

    this.isSubmittingAddOwner = true;
    this.ownersErrorMessage = null;
    const payload: CreateOwnerDto = this.addOwnerForm.value;

    this.apiService.createOwner(this.serviceId, this.resourceId, payload).subscribe({
      next: (createdOwner) => {
        alert(`Owner "${createdOwner.name}" added successfully!`);
        this.loadOwners();
        this.cancelAddOwner();
      },
      error: (err) => { this.ownersErrorMessage = err.message || 'Failed to add owner.'; },
      complete: () => this.isSubmittingAddOwner = false
    });
  }

  startEditOwner(owner: OwnerSummary): void {
    this.editingOwnerId = owner.id;
    this.editOwnerForm.setValue({
      name: owner.name,
      accountNumber: owner.accountNumber,
      level: owner.level
    });
    this.isAddingOwner = false;
    this.ownersErrorMessage = null;
  }

  cancelEditOwner(): void {
    this.editingOwnerId = null;
    this.editOwnerForm.reset();
  }

  saveOwnerEdit(): void {
    if (this.editOwnerForm.invalid || !this.editingOwnerId) {
      this.editOwnerForm.markAllAsTouched();
      this.ownersErrorMessage = "Owner details are invalid for update.";
      return;
    }

    this.isSubmittingEditOwner = true;
    this.ownersErrorMessage = null;
    const payload: UpdateOwnerDto = this.editOwnerForm.value;

    this.apiService.updateOwner(this.serviceId, this.resourceId, this.editingOwnerId, payload).subscribe({
      next: (updatedOwner) => {
        alert(`Owner "${updatedOwner.name}" updated successfully!`);
        this.loadOwners();
        this.cancelEditOwner();
      },
      error: (err) => { this.ownersErrorMessage = err.message || 'Failed to update owner.'; },
      complete: () => this.isSubmittingEditOwner = false
    });
  }

  deleteOwner(ownerToDelete: OwnerSummary): void {
    if (!ownerToDelete || !ownerToDelete.id) {
      this.ownersErrorMessage = "Owner information is missing, cannot delete.";
      return;
    }
    if (confirm(`Are you sure you want to delete owner "${ownerToDelete.name || 'this owner'}" (ID: ${ownerToDelete.id})? This action cannot be undone.`)) {
      this.isDeletingOwner(ownerToDelete.id, true)
      this.ownersErrorMessage = null;

      this.apiService.deleteOwner(this.serviceId, this.resourceId, ownerToDelete.id).subscribe({
        next: () => {
          alert('Owner deleted successfully!');
          this.loadOwners();
        },
        error: (err) => {
          this.ownersErrorMessage = err.message || `Failed to delete owner ${ownerToDelete.name}.`;
          console.error(`Error deleting owner ${ownerToDelete.id}:`, err);
          this.isDeletingOwner(ownerToDelete.id, false);
        }
      });
    }
  }

  public isDeletingOwner(ownerId: string, state?: boolean): boolean {
    if (typeof state !== 'undefined') {
      this.deletingOwnerFlags[ownerId] = state;
    }
    return this.deletingOwnerFlags[ownerId] || false;
  }

  goBackToManageResources(): void {
    this.router.navigate(['/services', this.serviceId, 'manage-resources']);
  }
}

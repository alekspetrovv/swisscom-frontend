import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ServiceSummary} from '../../models/service-summary.model';
import {CreateServiceDto} from '../../models/create-service.model';
import {UpdateServiceDto} from '../../models/update-service.model';
import {ResourceSummary} from '../../models/resource-summary.model';
import {CreateResourceDto} from '../../models/create-resource.model';
import {UpdateResourceDto} from '../../models/update-resource.model';
import {OwnerSummary} from '../../models/owner-summary.model';
import {CreateOwnerDto} from '../../models/create-owner.model';
import {UpdateOwnerDto} from '../../models/update-owner.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly servicesUrl = '/api/services';

  constructor(private http: HttpClient) { }

  createService(serviceData: CreateServiceDto): Observable<ServiceSummary> {
    return this.http.post<ServiceSummary>(this.servicesUrl, serviceData, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createResource(serviceId: string, resourceData: CreateResourceDto): Observable<ResourceSummary> {
    return this.http.post<ResourceSummary>(`${this.servicesUrl}/${serviceId}/resources`, resourceData, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createOwner(serviceId: string, resourceId: string, ownerDto: CreateOwnerDto): Observable<ResourceSummary> {
    return this.http.post<ResourceSummary>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}/owners`, ownerDto, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getAllServices(): Observable<ServiceSummary[]> {
    return this.http.get<ServiceSummary[]>(this.servicesUrl)
      .pipe(catchError(this.handleError));
  }

  getServiceById(serviceId: string): Observable<ServiceSummary> {
    return this.http.get<ServiceSummary>(`${this.servicesUrl}/${serviceId}`)
      .pipe(catchError(this.handleError));
  }

  getResourceById(serviceId: string, resourceId: string): Observable<ResourceSummary> {
    return this.http.get<ResourceSummary>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}`)
      .pipe(catchError(this.handleError));
  }

  getOwnersForResource(serviceId: string, resourceId: string): Observable<OwnerSummary[]> {
    return this.http.get<OwnerSummary[]>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}/owners`)
      .pipe(catchError(this.handleError));
  }


  getResourcesForService(serviceId: string): Observable<ResourceSummary[]> {
    return this.http.get<ResourceSummary[]>(`${this.servicesUrl}/${serviceId}/resources`)
      .pipe(catchError(this.handleError));
  }

  updateService(serviceId: string, serviceData: UpdateServiceDto): Observable<ServiceSummary> {
    return this.http.put<ServiceSummary>(`${this.servicesUrl}/${serviceId}`, serviceData, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateResource(resourceId: string, serviceId: string, resourceDto: UpdateResourceDto): Observable<ResourceSummary> {
    return this.http.put<ResourceSummary>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}`, resourceDto, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateOwner(serviceId: string, resourceId: string, ownerId: string, ownerDto: UpdateOwnerDto): Observable<OwnerSummary> {
    return this.http.put<OwnerSummary>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}/owners/${ownerId}`, ownerDto, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  deleteService(serviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.servicesUrl}/${serviceId}`)
      .pipe(catchError(this.handleError));
  }

  deleteResource(resourceId: string, serviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  deleteOwner(serviceId: string, resourceId: string, ownerId: string): Observable<void> {
    return this.http.delete<void>(`${this.servicesUrl}/${serviceId}/resources/${resourceId}/owners/${ownerId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}

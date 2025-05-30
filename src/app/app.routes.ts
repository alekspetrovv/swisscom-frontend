import { Routes } from '@angular/router';
import {ServiceList} from './components/service-list/service-list';
import {ServiceManageResources} from './components/service-manage-resources/service-manage-resources';
import {ResourceManageOwners} from './components/resource-manage-owners/resource-manage-owners';

export const routes: Routes = [
  { path: '', redirectTo: 'manage-services', pathMatch: 'full' },
  { path: 'manage-services', component: ServiceList, title: 'Services List' },
  { path: 'services/:serviceId/manage-resources', component: ServiceManageResources, title: 'Manage Service Resources' },
  {
    path: 'services/:serviceId/resources/:resourceId/manage-owners',
    component: ResourceManageOwners,
    title: 'Manage Resource Owners'
  },
];

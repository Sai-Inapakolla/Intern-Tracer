import { Routes } from '@angular/router';
import { ViewApplicationsComponent } from './components/view-applications/view-applications.component';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { UpdateApplicationComponent } from './components/update-application/update-application.component';

export const routes: Routes = [
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: 'applications', component: ViewApplicationsComponent },
  { path: 'create', component: AddApplicationComponent },
  { path: 'update/:id', component: UpdateApplicationComponent },
  { path: '**', redirectTo: '/applications' }
];

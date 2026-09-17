import { Routes } from '@angular/router';
import { ViewApplicationsComponent } from './components/view-applications/view-applications.component';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { UpdateApplicationComponent } from './components/update-application/update-application.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'applications', component: ViewApplicationsComponent, canActivate: [authGuard] },
  { path: 'create', component: AddApplicationComponent, canActivate: [authGuard] },
  { path: 'update/:id', component: UpdateApplicationComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/applications' }
];

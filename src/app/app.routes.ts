import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DocumentComponent } from './document/document.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'document', component: DocumentComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DocumentComponent } from './document/document.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';

export const routes: Routes = [
  {path:'',redirectTo: '/login', pathMatch:'full'},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'documents', component: DocumentComponent },
  { path: 'document/:id', component: DocumentDetailComponent }, // Route for document detail
  { path: 'documents/create-document', component: CreateDocumentComponent }
];
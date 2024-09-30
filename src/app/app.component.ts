import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Ensure this import is present
import { RouterLink, RouterLinkActive } from '@angular/router'; // Ensure these imports are present
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DocumentComponent } from './document/document.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive,SidebarComponent, DocumentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppComponent {
  title = 'real-time-collab-frontend';
}

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClient } from '@angular/common/http'; // Import HttpClient instead

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: HttpClient, useClass: HttpClient } // Use HttpClient directly
  ]
}).catch(err => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptors , withInterceptorsFromDi} from '@angular/common/http';
import { AuthInterceptor } from './app/auth.interceptor'; // Ensure you have the correct import
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi()

    ),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // {{ edit_2 }}
  ]
}).catch(err => console.error(err));
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Send the request to the next handler
    console.log('intercepted request', req);
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Check if the response has an Authorization header
          const token = event.headers.get('Authorization');
          console.log('token', token);
          if (token) {
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', token);
          }
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Intercepting request:", req.url);

        // Skip adding headers for login requests (or any other public routes)
        if (req.url.includes('/login')) { 
            return next.handle(req); // Skip interception and pass the request directly
        }

        // Otherwise, clone the request and add the authorization header
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.getAuthToken()}`, // Example header
            }
        });

        // Pass the modified request to the next handler in the chain
        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) { // Unauthorized access
                    this.router.navigate(['/login']); // Redirect to login
                }
                return throwError(() => error); // Updated to use the arrow function in Angular 18
            })
        );
    }


    private getAuthToken(): string|null{
        // Logic to retrieve authentication token (mock example)
        
        return localStorage.getItem('token')
    }
}

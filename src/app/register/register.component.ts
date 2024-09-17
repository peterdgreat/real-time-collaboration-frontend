import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms'; // Use this for template-driven forms
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, HttpClientModule, CommonModule] // Ensure these are valid imports
})
export class RegisterComponent {
  user = { email: '', password: '', password_confirmation: '' };
  errorMessage: string | null = null;
  loading: boolean = false; // Loading state

  constructor(private apiService: ApiService, private router: Router) {}

  register() {
    this.loading = true; // Set loading to true
    this.apiService.register(this.user).subscribe({
      next: response => {
        console.log('Registration successful', response);
        this.loading = false; // Set loading to false
        this.errorMessage = null; // Clear any error message
        this.router.navigate(['/login']); // Redirect to login page
        // Optionally, redirect or show a success message
      },
      error: error => {
        this.loading = false; // Set loading to false
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    if (error.error && error.error.message) {
      // Assuming the backend returns an error message in this format
      this.errorMessage = error.error.message;
    } else if (error.status === 400) {
      // Handle specific status codes
      this.errorMessage = 'Invalid input. Please check your data.';
    } else if (error.status === 409) {
      // Conflict, e.g., email already exists
      this.errorMessage = 'Email already exists. Please use a different email.';
    } else {
      // Generic error message
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
  }
}
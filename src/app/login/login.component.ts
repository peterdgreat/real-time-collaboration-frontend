import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule,CommonModule], // Add ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }



  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
        next: response => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/documents']);
        },
        error: error => {
          this.handleError(error);
        }
      });
    }
  }

  navigateToSignup() { // {{ edit_4 }}
    this.router.navigate(['/register']); // Adjust the route as necessary
}

  private handleError(error: any) {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 401) {
      this.errorMessage = 'Invalid credentials. Please try again.';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
  }
}
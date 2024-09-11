import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private apiService: ApiService) {}

  login() {
    this.apiService.login(this.credentials).subscribe({
      next: response => {
        console.log('Login successful', response);
        // Store the token for future requests
        localStorage.setItem('token', response.token);
      },
      error: error => {
        console.error('Login error', error);
      }
    });
  }
}
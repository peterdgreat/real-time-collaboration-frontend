import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule] // Import FormsModule for template-driven forms
})
export class RegisterComponent {
  user = { email: '', password: '', password_confirmation: '' };

  constructor(private apiService: ApiService) {}

  register() {
    this.apiService.register(this.user).subscribe({
      next: response => {
        console.log('Registration successful', response);
      },
      error: error => {
        console.error('Registration error', error);
      }
    });
  }
}
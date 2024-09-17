import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-document',
  standalone: true,
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class CreateDocumentComponent {
  documentForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router) {
    this.documentForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  createDocument() {
    if (this.documentForm.valid) {
      this.loading = true;
      this.apiService.createDocument(localStorage.getItem('token') || '', this.documentForm.value).subscribe({
        next: response => {
          console.log('Document created successfully', response);
          this.loading = false;
          this.router.navigate(['/documents']); // Redirect to documents list
        },
        error: error => {
          this.loading = false;
          this.handleError(error);
        }
      });
    }
  }

  private handleError(error: any) {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred while creating the document. Please try again later.';
    }
  }
}

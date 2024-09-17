import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-document',
  standalone: true,
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  imports: [CommonModule, HttpClientModule]
})
export class DocumentComponent {
  documents: any[] = [];
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.apiService.getDocuments(
      localStorage.getItem('token') || ''
    ).subscribe({
      next: response => {
        console.log(response);
        this.documents = response; // Assuming response is an array of documents
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  viewDocument(documentId: string) {
    this.router.navigate(['/document', documentId]); // Navigate to the document detail page
  }
  createDocument() {
    this.router.navigate(['/create-document']); // Navigate to the document creation page
  }

  private handleError(error: any) {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred while loading documents. Please try again later.';
    }
  }
}
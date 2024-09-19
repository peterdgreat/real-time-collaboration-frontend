import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CableService } from '../cable.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class DocumentDetailComponent implements OnInit {
  document: any;
  errorMessage: string | null = null;
  loading: boolean = false;
  isShareModalOpen: boolean = false; // Track modal state
  shareEmail: string = ''; // Email input for sharing

  constructor(private route: ActivatedRoute, private apiService: ApiService, private cableService: CableService) {}

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('id');
    this.loadDocument(documentId);
  }

  loadDocument(documentId: string | null) {
    if (documentId) {
      this.loading = true;
      const token = localStorage.getItem('token') || '';
      this.apiService.getDocument(token, documentId).subscribe(
        (document) => {
          this.document = document; // Load the document data
          this.cableService.subscribeToDocument(documentId); // Subscribe to updates
          this.cableService.documentUpdates.subscribe((data: any) => {
            console.log('Document update received:', data);
            if (data.document) {
              this.document = data.document; // Update the document with the latest data
            }
          });
          this.loading = false; // Stop loading
        },
        (error) => {
          this.handleError(error);
          this.loading = false; // Stop loading on error
        }
      );
    }
  }

  private handleError(error: any) {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred while loading the document. Please try again later.';
    }
  }

  onContentChange() {
    if (this.document) {
      // Send the updated document content to the server
      const token = localStorage.getItem('token') || '';
      this.apiService.updateDocument(token, this.document.id, { content: this.document.content }).subscribe(
        (response) => {
          console.log('Document updated successfully:', response);
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  onTitleChange() {
    if (this.document) {
      // Send the updated document title to the server
      const token = localStorage.getItem('token') || '';
      this.apiService.updateDocument(token, this.document.id, { title: this.document.title }).subscribe(
        (response) => {
          console.log('Document title updated successfully:', response);
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  onShareDocument() {
    if (this.document) {
      const token = localStorage.getItem('token') || '';
      console.log('dco sharing', this.shareEmail);

      this.apiService.shareDocument(token, this.document.id, this.shareEmail).subscribe(
        (response) => {
          console.log('Document shared successfully:', response);
          this.closeShareModal();
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  // Method to open the share modal
  openShareModal() {
    this.isShareModalOpen = true;
  }

  // Method to close the share modal
  closeShareModal() {
    this.isShareModalOpen = false;
    this.shareEmail = ''; // Reset email input
  }

  // Method to share the document
  shareDocument() {
    // Implement your share logic here, e.g., API call
    console.log(`Sharing document with ${this.shareEmail}`);
    this.closeShareModal(); // Close modal after sharing
  }
}

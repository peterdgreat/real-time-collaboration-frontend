import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { CableService } from '../cable.service';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router

// Utility function to strip HTML tags
function stripHtmlTags(input: string): string {
  const div = document.createElement('div');
  div.innerHTML = input;
  return div.textContent || div.innerText || ''; // Ensure it returns plain text
}

@Component({
  selector: 'app-create-document',
  standalone: true,
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxEditorModule,
  ],
})
export class CreateDocumentComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  loading: boolean = false;
  editor!: Editor; // Use non-null assertion
  html = ''; // This will hold the editor content
  documentTitle: string = ''; // This will hold the document title
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  private autoSaveTimeout: any; 
  constructor(
    private apiService: ApiService,
    private cableService: CableService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      // Check if in browser environment
      this.editor = new Editor();
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  // Method to handle content changes from the editor
  onContentChange(content: string) {
    this.html = content; // Update html with editor content
    this.updateTitle();

    this.autoSave(); // Call autoSave whenever content changes
  }

  updateTitle() {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.html; // Set the HTML content

    // Get the first <p> tag
    const firstParagraph = tempDiv.querySelector('p');
    // Set the title to the text content of the first <p> tag, or default to 'Untitled Document'
    this.documentTitle = firstParagraph ? firstParagraph.textContent?.trim() || 'Untitled Document' : 'Untitled Document';

    console.log("setting doc title", this.documentTitle);
  }
  createDocument() {
    this.loading = true;
    const token = localStorage.getItem('token') || '';
    const sanitizedContent = stripHtmlTags(this.html); // Strip HTML tags

    console.log('Sanitized Content:', sanitizedContent); // Log sanitized content
    console.log('Sanitized title:', this.documentTitle); 
    // Ensure the content is sent as part of a document object
    this.apiService
      .createDocument(token, {
        title: this.documentTitle,
        content: sanitizedContent,
      })
      .subscribe({
        next: (response) => {
          console.log('Document created successfully', response);
          this.loading = false;
          this.cableService.documentUpdates.next(response);
        },
        error: (error) => {
          this.loading = false;
          this.handleError(error);
        },
      });
  }

  autoSave() {
    const token = localStorage.getItem('token') || '';
    this.loading = true;
    const sanitizedContent = stripHtmlTags(this.html); // Strip HTML tags

    if (sanitizedContent.trim()) {
      console.log('Sanitized Content:', sanitizedContent); // Log sanitized content
      console.log('Sanitized title:', this.documentTitle); 
      clearTimeout(this.autoSaveTimeout); // Clear any existing timeout
      this.autoSaveTimeout = setTimeout(() => { // Set a new timeout
        this.apiService
          .createDocument(token, {
            title: this.documentTitle,
            content: sanitizedContent,
          })
          .subscribe({
            next: (response) => {
              console.log('Document saved successfully', response);
              this.loading = false;
              this.cableService.documentUpdates.next(response);
            },
            error: (error) => {
              setTimeout(() => {
                this.loading = false; // Hide loading indicator after a delay
              }, 60000); // Adjust the duration as needed (e.g., 2000 ms = 2 seconds)

              this.handleError(error);
            },
          });
      }, 2000); // Adjust the duration as needed (e.g., 2000 ms = 2 seconds)
    }
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage =
        'An unexpected error occurred while creating the document. Please try again later.';
    }
  }

  goBack() {
    this.router.navigate(['/documents']); // Navigate to the previous route
  }
}

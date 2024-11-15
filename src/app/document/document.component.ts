import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';

interface Document {
  is_owned: boolean;
  // Add other properties as needed
}

function stripHtmlTags(input: string): string {
  const div = document.createElement('div');
  div.innerHTML = input;
  return div.textContent || div.innerText || ''; // Ensure it returns plain text
}
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule,NgxEditorModule,ReactiveFormsModule],
  providers: [ApiService],
})
export class DocumentComponent implements OnInit, OnDestroy  {
  documents: any[] = []; // Array to hold all documents
  sharedDocuments: any[] = []; // Array to hold shared documents
  ownedDocuments: any[] = []; // Array to hold owned documents
  selectedType: 'all' | 'shared' | 'owned' | null = null; // Track selected tab
  selectedDocument: any = null; // Track selected document
  loading: boolean = false; // Track loading state
  errorMessage: string = ''; // Track error messages
  isEditing: boolean = false;
  authToken: string = '';
  createdAgo: string = '';
  updatedAgo: string = '';
  moreActionsVisible = false;
  isShareModalOpen: boolean = false;
  shareEmail: string = '';
  isShareSuccess: boolean = false;
  isShareError: boolean = false;
  isEmailValid:boolean = true;
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
  

  contributors = [
    { name: 'Michael Brown' },
    { name: 'Beth Carter' },
    { name: 'Cindy Thompson' },
    { name: 'Tom Riddle' },
  ];

  private autoSaveTimeout: any; 
  private documentId: string | null = null; 
  constructor(private apiService: ApiService) {} // Inject ApiService

  ngOnInit() {
    this.loadDocuments('all'); // Load all documents by default
    this.authToken = localStorage.getItem('token') || '';
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

  private handleError(error: any) {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage =
        'An unexpected error occurred while loading the document. Please try again later.';
    }
  }



  loadDocuments(type: 'all' | 'shared' | 'owned') {
    this.selectedType = type;
    this.loading = true;
    this.selectedDocument = null;
    const token = localStorage.getItem('token') || '';

    this.apiService.getDocuments(token, 'all').subscribe({
      next: (response) => {
        this.documents = response; // Load all documents
        this.sharedDocuments = response.filter(
          (doc: Document) => !doc.is_owned
        ); // Filter shared documents
        this.ownedDocuments = response.filter((doc: Document) => doc.is_owned); // Filter owned documents
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while loading documents.';
        this.loading = false;
      },
    });
  }

  viewDocument(documentId: number) {
    // Update selectedType based on the document's ownership
    const document = this.documents.find((doc) => doc.id === documentId);
    if (document) {
      this.selectedType = document.is_owned ? 'owned' : 'shared'; // Set selectedType based on document ownership
    } else {
      this.selectedType = 'all'; // Default to 'all' if document not found
    }

    // Find the document by ID from the appropriate array based on selectedType
    const documents =
      this.selectedType === 'all'
        ? this.documents
        : this.selectedType === 'shared'
        ? this.sharedDocuments
        : this.ownedDocuments;
    console.log('selectedttyoe', this.selectedType);
    console.log(documents);
    this.selectedDocument =
      documents.find((doc) => doc.id === documentId) || null; // Set the selected document
    this.createdAgo = this.calculateTimeAgo(this.selectedDocument.created_at);
    this.updatedAgo = this.calculateTimeAgo(this.selectedDocument.updated_at);
    console.log('selected', this.selectedDocument);
  }

  calculateTimeAgo(date: string): string {
    return moment(date).fromNow();
  }

  onTypeSelected(type: 'all' | 'shared' | 'owned') {
    this.selectedType = type; // Set the selected type
    this.loadDocuments(type); // Load documents based on the selected type
  }

  toggleEdit() {
    this.isEditing = !this.isEditing; // Toggle the editing state
    if (this.isEditing) {
        this.html = this.selectedDocument.content; // Set the editor content to the current document content
    } else {
        this.updateDocument(); // Call updateDocument when exiting edit mode
    }
    this.moreActionsVisible = false;
  }

  updateDocument() {
    if (this.selectedDocument) {
      // Ensure the content from the ngx-editor is included in the update
      this.selectedDocument.content = this.html; // Update the content from the editor

      this.apiService
        .updateDocument(
          this.authToken,
          this.selectedDocument.id,
          this.selectedDocument
        )
        .subscribe(
          (response) => {
            console.log('Document updated successfully:', response);
          },
          (error) => {
            console.error('Error updating document:', error);
          }
        );
    }
  }

  // Get initials from contributor's name
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  }

  toggleMoreActions() {
    this.moreActionsVisible = !this.moreActionsVisible;
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(this.shareEmail);
  }
  onShareDocument() {
    if (this.selectedDocument && this.isEmailValid) {
      const token = localStorage.getItem('token') || '';
      console.log('dco sharing', this.shareEmail);

      this.apiService
        .shareDocument(token, this.selectedDocument.id, this.shareEmail)
        .subscribe(
          (response) => {
            console.log('Document shared successfully:', response);
            this.isShareSuccess = true;
           // Reset email input
            this.closeShareModal(); // Close the modal
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.isShareSuccess = false;
            }, 3000);
      
          },
          (error) => {
            this.isShareSuccess = false; // Hide any previous success message
            this.isShareError = true;
            console.log(error.error.error)
            this.errorMessage =error.error.error;
            
            // Hide error message after 3 seconds
            setTimeout(() => {
              this.isShareError = false;
            }, 3000);
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
    // this.shareEmail = ''; // Reset email input
  }

  // Method to share the document
  shareDocument() {
    // Implement your share logic here, e.g., API call
    console.log(`Sharing document with ${this.shareEmail}`);
    this.closeShareModal(); // Close modal after sharing
  }

  deleteDocument() {
    console.log('Document deleted!');
    this.moreActionsVisible = false; // Hide dropdown after action
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

  onContentChange(content: string) {
    this.html = content; // Update html with editor content
    this.updateTitle();

    this.updateDocument(); // Call autoSave whenever content changes
  }
}

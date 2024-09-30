import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CableService } from '../cable.service';
import { QuillModule } from 'ngx-quill';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-create-document',
  standalone: true,
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, QuillModule]
})
export class CreateDocumentComponent {
  documentForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;
  modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],  // toggled buttons
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],  // outdent/indent
      [{ 'direction': 'rtl' }],  // text direction
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']  // remove formatting button
    ]
  };
  
  
  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router, private cableService: CableService) {
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    // Auto-save content whenever the form changes
    this.documentForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.autoSave();
    });

  }

  // createDocument() {
  //   if (this.documentForm.valid) {
  //     this.loading = true;
  //     this.apiService.createDocument(localStorage.getItem('token') || '', this.documentForm.value).subscribe({
  //       next: response => {
  //         console.log('Document created successfully', response);
  //         this.loading = false;
  //         this.router.navigate(['/documents']); // Redirect to documents list
  //       },
  //       error: error => {
  //         this.loading = false;
  //         this.handleError(error);
  //       }
  //     });
  //   }
  // }
  createDocument() {
    if (this.documentForm.valid) {
      this.loading = true;
      this.apiService.createDocument(localStorage.getItem('token') || '', this.documentForm.value).subscribe({
        next: response => {
          console.log('Document created successfully', response);
          this.loading = false;
          // Emit the new document creation event
          this.cableService.documentUpdates.next(response); // Emit new document to subscribers
          //this.router.navigate(['/documents']); // Redirect to documents list
        },
        error: error => {
          this.loading = false;
          this.handleError(error);
        }
      });
    }
  }
  
  autoSave() {
    if (this.documentForm.valid) {
      const token = localStorage.getItem('token') || '';
      const documentData = this.documentForm.value;
      this.loading = true;

      this.apiService.createDocument(token, documentData).subscribe({
        next: (response) => {
          console.log('Document saved successfully', response);
          this.loading = false;
          // Emit real-time updates through WebSocket
          this.cableService.documentUpdates.next(response);
        },
        error: (error) => {
          this.loading = false;
          this.handleError(error);
        },
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

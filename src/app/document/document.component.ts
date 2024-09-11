import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document',
  standalone: true,
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  imports: [FormsModule]
})
export class DocumentComponent {
  document = { title: '', content: '' };

  constructor(private apiService: ApiService) {}

  createDocument() {
    const token = localStorage.getItem('token')|| '';
    this.apiService.createDocument(token, this.document).subscribe({
      next: response => {
        console.log('Document created', response);
      },
      error: error => {
        console.error('Error creating document', error);
      }
    });
  }
}
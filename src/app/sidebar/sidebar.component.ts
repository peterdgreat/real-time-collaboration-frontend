import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule],
})
export class SidebarComponent {
  selectedType: string = 'all'; // Default selected type
  @Output() typeSelected = new EventEmitter<'all' | 'shared' | 'owned'>(); // Emit selected type
  @Output() documentSelected = new EventEmitter<number>(); // Emit selected document ID
  @Input() allDocuments: any[] = []; // Add this line
  @Input() sharedDocuments: any[] = []; // Add this line
  @Input() ownedDocuments: any[] = []; // Add this line
  userEmail: string = 'Peter';

  constructor(private router: Router) {}

  isCollapsed: { [key: string]: boolean } = {
    all: false,
    shared: false,
    owned: false,
  };

  toggleCollapse(type: 'all' | 'shared' | 'owned') {
    console.log('toggleCollapse', type);
    this.isCollapsed[type] = !this.isCollapsed[type];
    this.typeSelected.emit(type); // Emit the selected type
  }

  selectDocument(id: number) {
    this.documentSelected.emit(id); // Emit the selected document ID
  }

  // Method to set documents (to be called from the parent component)
  setDocuments(all: any[], shared: any[], owned: any[]) {
    this.allDocuments = all;
    this.sharedDocuments = shared;
    this.ownedDocuments = owned;
  }

  addNewDocument() {
    this.router.navigate(['documents/create-document']);
  }
}

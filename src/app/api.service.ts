import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl; // Your Rails API URL

  constructor(private http: HttpClient) {}

  // User registration
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { user });
  }

  // User login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { user: credentials });
  }

  // Create a document
  createDocument(token: string, document: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/api/v1/documents`, { document }, { headers });
  }

  // Get a single document
  getDocument(token: string, documentId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/api/v1/documents/${documentId}`, { headers });
  }

  // Get all documents
  getDocuments(token: string, type?: string): Observable<any> {
    console.log('Getting documents with type:', type);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/api/v1/documents?type=${type}`, { headers });
  }

  // Create a comment
  createComment(token: string, comment: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/api/v1/comments`, { comment }, { headers });
  }

  // Create a task
  createTask(token: string, task: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/api/v1/tasks`, { task }, { headers });
  }

  // Update a document
  updateDocument(token: string, documentId: string, document: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/api/v1/documents/${documentId}`, { document }, { headers });
  }

  //share document
  shareDocument(token: string, documentId: string, email: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/api/v1/documents/${documentId}/share`, { email }, { headers });
  }
}
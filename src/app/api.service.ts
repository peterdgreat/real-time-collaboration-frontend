import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/v1'; // Your Rails API URL

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
    return this.http.post(`${this.apiUrl}/documents`, { document }, { headers });
  }

  // Create a comment
  createComment(token: string, comment: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/comments`, { comment }, { headers });
  }

  // Create a task
  createTask(token: string, task: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/tasks`, { task }, { headers });
  }
}
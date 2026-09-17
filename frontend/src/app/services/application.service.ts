import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = environment.apiUrl;
  private fileBaseUrl = environment.fileBaseUrl;

  constructor(private http: HttpClient) { }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplication(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateApplication(id: string, application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}`, application);
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadResume(file: File): Observable<{ resumeUrl: string }> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post<{ resumeUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

  getResumeFullUrl(resumeUrl?: string): string {
    if (!resumeUrl) return '';
    if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
      return resumeUrl;
    }
    return `${this.fileBaseUrl}${resumeUrl.startsWith('/') ? '' : '/'}${resumeUrl}`;
  }
}


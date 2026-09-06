import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-view-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-applications.component.html',
  styleUrls: ['./view-applications.component.css']
})
export class ViewApplicationsComponent implements OnInit {
  applications: Application[] = [];
  applicationsLoading = true;
  errorMessage = '';
  
  statuses: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];
  
  constructor(
    private service: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationsLoading = true;
    this.service.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.applicationsLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading applications';
        this.applicationsLoading = false;
        console.error('Error:', err);
      }
    });
  }

  getApplicationsByStatus(status: ApplicationStatus): Application[] {
    return this.applications.filter(app => app.status === status);
  }

  editApplication(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/update', id]);
    }
  }

  deleteApplication(id: string | undefined): void {
    if (id && confirm('Are you sure you want to delete this application?')) {
      this.service.deleteApplication(id).subscribe({
        next: () => {
          this.applications = this.applications.filter(app => app._id !== id);
        },
        error: (err) => {
          this.errorMessage = 'Error deleting application';
          console.error('Error:', err);
        }
      });
    }
  }

  addNewApplication(): void {
    this.router.navigate(['/create']);
  }

  getStatusColor(status: ApplicationStatus): string {
    const colors: { [key in ApplicationStatus]: string } = {
      'Applied': '#2196F3',
      'Interview': '#FF9800',
      'Offer': '#4CAF50',
      'Rejected': '#f44336'
    };
    return colors[status];
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

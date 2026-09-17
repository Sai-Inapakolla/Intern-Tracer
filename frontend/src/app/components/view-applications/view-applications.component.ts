import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-view-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-applications.component.html',
  styleUrls: ['./view-applications.component.css']
})
export class ViewApplicationsComponent implements OnInit {
  applications: Application[] = [];
  applicationsLoading = true;
  errorMessage = '';
  searchQuery = '';
  selectedFilter: string = 'ALL';
  toastMessage = '';
  
  statuses: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];
  
  constructor(
    private service: ApplicationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationsLoading = true;
    this.errorMessage = '';
    this.service.getApplications().subscribe({
      next: (data) => {
        this.applications = data || [];
        this.applicationsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error loading applications. Check backend connection.';
        this.applicationsLoading = false;
        this.cdr.detectChanges();
        console.error('Error:', err);
      }
    });
  }

  get filteredApplications(): Application[] {
    return this.applications.filter(app => {
      const matchesSearch = !this.searchQuery || 
        app.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (app.notes && app.notes.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesFilter = this.selectedFilter === 'ALL' || app.status === this.selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }

  getApplicationsByStatus(status: ApplicationStatus): Application[] {
    return this.filteredApplications.filter(app => app.status === status);
  }

  get totalCount(): number {
    return this.applications.length;
  }

  getCountByStatus(status: ApplicationStatus): number {
    return this.applications.filter(app => app.status === status).length;
  }

  get offerRate(): number {
    if (this.totalCount === 0) return 0;
    const offers = this.getCountByStatus('Offer');
    return Math.round((offers / this.totalCount) * 100);
  }

  editApplication(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/update', id]);
    }
  }

  deleteApplication(id: string | undefined, event?: Event): void {
    if (event) event.stopPropagation();
    if (id && confirm('Are you sure you want to delete this application?')) {
      this.service.deleteApplication(id).subscribe({
        next: () => {
          this.applications = this.applications.filter(app => app._id !== id);
          this.showToast('Application removed');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Error deleting application';
          this.cdr.detectChanges();
          console.error('Error:', err);
        }
      });
    }
  }

  quickUpdateStatus(application: Application, newStatus: ApplicationStatus, event?: Event): void {
    if (event) event.stopPropagation();
    if (!application._id || application.status === newStatus) return;

    const updated = { ...application, status: newStatus };
    this.service.updateApplication(application._id, updated).subscribe({
      next: (res) => {
        const index = this.applications.findIndex(a => a._id === application._id);
        if (index !== -1) {
          this.applications[index] = res;
        }
        this.showToast(`Status updated to ${newStatus}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to update status';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  addNewApplication(): void {
    this.router.navigate(['/create']);
  }

  getCompanyInitial(company: string): string {
    return company ? company.trim().charAt(0).toUpperCase() : '?';
  }

  getCompanyAvatarBg(company: string): string {
    const colors = [
      'linear-gradient(135deg, #6366f1, #8b5cf6)',
      'linear-gradient(135deg, #ec4899, #f43f5e)',
      'linear-gradient(135deg, #3b82f6, #06b6d4)',
      'linear-gradient(135deg, #10b981, #14b8a6)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #8b5cf6, #d946ef)'
    ];
    let hash = 0;
    for (let i = 0; i < company.length; i++) {
      hash = company.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    switch (status) {
      case 'Applied': return 'badge-applied';
      case 'Interview': return 'badge-interview';
      case 'Offer': return 'badge-offer';
      case 'Rejected': return 'badge-rejected';
      default: return '';
    }
  }

  getResumeFullUrl(url?: string): string {
    return this.service.getResumeFullUrl(url);
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

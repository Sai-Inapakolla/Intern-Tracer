import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-update-application',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-application.component.html',
  styleUrls: ['./update-application.component.css']
})
export class UpdateApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  statusOptions: ApplicationStatus[] = ['Applied', 'Interview', 'Rejected', 'Offer'];
  applicationId: string = '';
  existingResumeUrl?: string;
  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public service: ApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.applicationId = params['id'];
      this.loadApplication();
    });
  }

  loadApplication(): void {
    this.service.getApplication(this.applicationId).subscribe({
      next: (application: Application) => {
        this.existingResumeUrl = application.resumeUrl;
        this.initializeForm(application);
      },
      error: (err) => {
        this.errorMessage = 'Error loading application. Please try again.';
        console.error('Error:', err);
      }
    });
  }

  initializeForm(application: Application): void {
    this.applicationForm = this.fb.group({
      company: [application.company, [Validators.required, Validators.minLength(2)]],
      role: [application.role, [Validators.required, Validators.minLength(2)]],
      appliedDate: [this.formatDate(application.appliedDate), Validators.required],
      status: [application.status, Validators.required],
      notes: [application.notes || '']
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  getResumeFullUrl(url?: string): string {
    return this.service.getResumeFullUrl(url);
  }

  updateApplication(): void {
    if (this.applicationForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.applicationForm.value;
    const updatedApplication: Application = {
      company: formValue.company,
      role: formValue.role,
      appliedDate: new Date(formValue.appliedDate),
      status: formValue.status,
      notes: formValue.notes,
      resumeUrl: this.existingResumeUrl
    };

    if (this.selectedFile) {
      this.service.uploadResume(this.selectedFile).subscribe({
        next: (uploadRes) => {
          updatedApplication.resumeUrl = uploadRes.resumeUrl;
          this.submitUpdate(updatedApplication);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Error uploading resume. Please check file format and size.';
          console.error('Upload error:', err);
        }
      });
    } else {
      this.submitUpdate(updatedApplication);
    }
  }

  private submitUpdate(application: Application): void {
    this.service.updateApplication(this.applicationId, application).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/applications']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error updating application. Please try again.';
        console.error('Error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/applications']);
  }
}

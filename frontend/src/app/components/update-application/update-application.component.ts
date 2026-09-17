import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  fetching = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public service: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.createEmptyForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.applicationId = params['id'];
      if (this.applicationId) {
        this.loadApplication();
      }
    });
  }

  createEmptyForm(): void {
    this.applicationForm = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
      appliedDate: ['', Validators.required],
      status: ['Applied', Validators.required],
      notes: ['']
    });
  }

  loadApplication(): void {
    this.fetching = true;
    this.errorMessage = '';
    this.service.getApplication(this.applicationId).subscribe({
      next: (application: Application) => {
        this.fetching = false;
        this.existingResumeUrl = application.resumeUrl;
        this.applicationForm.patchValue({
          company: application.company,
          role: application.role,
          appliedDate: this.formatDate(application.appliedDate),
          status: application.status,
          notes: application.notes || ''
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.fetching = false;
        this.errorMessage = 'Application not found or may have been deleted.';
        this.cdr.detectChanges();
        console.error('Error loading application:', err);
      }
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

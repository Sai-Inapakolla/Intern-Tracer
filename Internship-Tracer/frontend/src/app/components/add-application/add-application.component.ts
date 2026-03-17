import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.css']
})
export class AddApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  statusOptions: ApplicationStatus[] = ['Applied', 'Interview', 'Rejected', 'Offer'];
  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
      appliedDate: ['', Validators.required],
      status: ['Applied', Validators.required],
      notes: ['']
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addApplication(): void {
    if (this.applicationForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.applicationForm.value;
    const newApplication: Application = {
      company: formValue.company,
      role: formValue.role,
      appliedDate: new Date(formValue.appliedDate),
      status: formValue.status,
      notes: formValue.notes
    };

    this.service.createApplication(newApplication).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/applications']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error creating application. Please try again.';
        console.error('Error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/applications']);
  }
}

export type ApplicationStatus = 'Applied' | 'Interview' | 'Rejected' | 'Offer';

export interface Application {
  _id?: string;
  company: string;
  role: string;
  appliedDate: Date;
  status: ApplicationStatus;
  resumeUrl?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types globaux de l'application
export type User = {
  id: string;
  name: string;
};

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  status: ApplicationStatus;
  notes?: string;
}

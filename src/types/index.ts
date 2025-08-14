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

export interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
  experience: {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  education: {
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  };
  skills: string;
  createdAt: string;
  updatedAt: string;
}

export interface CV {
  id: string;
  name: string;
  data: CVData;
}

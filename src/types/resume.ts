export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrentlyStudying: boolean;
  gpa?: string;
  description?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface ResumeData {
  contacts: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  certificates: Certificate[];
  skills: Skill[];
}

export type ResumeStep = 'contacts' | 'experience' | 'education' | 'skills' | 'summary' | 'finalize';

export interface ResumeStepInfo {
  id: ResumeStep;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}
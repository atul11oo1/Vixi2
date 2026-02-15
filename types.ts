
export enum Screen {
  LOGIN = 'login',
  SIGNUP = 'signup',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  MEMBERS = 'members',
  MEMBER_DETAIL = 'member_detail',
  AMBULANCE = 'ambulance',
  AI_ANALYZER = 'ai_analyzer',
  QR_SHARE = 'qr_share',
  PUBLIC_VIEW = 'public_view'
}

export interface UserProfile {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  photo?: string;
  registrationDate: string;
  registrationTime: string;
  isPremium: boolean;
}

export interface MedicalReport {
  id: string;
  type: string; // X-Ray, Blood, MRI, CT Scan, etc.
  date: string;
  fileData: string; // Base64
  analysis?: string;
}

export interface Disease {
  id: string;
  name: string;
  reports: MedicalReport[];
}

export interface Member {
  id: string;
  name: string;
  relation: string;
  diseases: Disease[];
}

export interface AppData {
  user: UserProfile | null;
  members: Member[];
  onboardingSeen: boolean;
}

export const REPORT_TYPES = [
  "Blood Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "ECG",
  "Urine Test",
  "Prescription",
  "Biopsy",
  "Other"
];

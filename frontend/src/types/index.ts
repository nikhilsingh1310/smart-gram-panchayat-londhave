export type Role = 'GUEST' | 'CITIZEN' | 'EMPLOYEE' | 'GP_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  mobile?: string;
  email?: string;
  name: string;
  role: Role;
  preferredLang: string;
  houseNo?: string;
  wardNo?: string;
  address?: string;
  department?: string;
}

export interface ContentTranslation {
  lang: string;
  title: string;
  subtitle?: string;
  body: string;
  metadata?: any;
}

export interface ContentItem {
  id: string;
  type: 'NEWS' | 'NOTICE' | 'SCHEME' | 'EVENT' | 'DOCUMENT' | 'ANNOUNCEMENT';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category?: string;
  isPinned: boolean;
  publishAt: string;
  mediaUrl?: string;
  docUrl?: string;
  translation?: ContentTranslation;
  isFallback?: boolean;
  missingLangs?: string[];
  allTranslations?: ContentTranslation[];
}

export interface Complaint {
  id: string;
  ticketNo: string;
  citizenId: string;
  citizenName: string;
  citizenMobile: string;
  category: 'WATER' | 'ELECTRICITY' | 'ROADS' | 'GARBAGE' | 'DRAINAGE' | 'STREETLIGHT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  title: string;
  description: string;
  location: string;
  wardNo?: string;
  photoUrl?: string;
  assignedTo?: { id: string; name: string; email: string };
  resolutionRemarks?: string;
  resolutionPhotoUrl?: string;
  createdAt: string;
  history?: Array<{ oldStatus: string; newStatus: string; actorName: string; remarks?: string; createdAt: string }>;
}

export interface TaxBill {
  id: string;
  billNo: string;
  citizenId: string;
  citizenName: string;
  propertyNo: string;
  houseNo: string;
  wardNo: string;
  taxType: 'PROPERTY_HOUSE' | 'WATER' | 'STREET_LIGHT' | 'SANITATION';
  amount: number;
  assessmentYear: string;
  dueDate: string;
  status: 'UNPAID' | 'PAID' | 'OVERDUE';
  payments?: Payment[];
}

export interface Payment {
  id: string;
  transactionId: string;
  billId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  receiptNo: string;
  paidAt: string;
}

export interface CertificateApp {
  id: string;
  applicationNo: string;
  citizenId: string;
  citizenName: string;
  citizenMobile: string;
  certType: 'BIRTH' | 'DEATH' | 'RESIDENCE' | 'NO_DUES' | 'INCOME_REF';
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  applicantDetails: any;
  docUrls: string[];
  issuedCertUrl?: string;
  adminRemarks?: string;
  appliedAt: string;
}

export interface PanchayatMember {
  id: string;
  name: string;
  designationEn: string;
  designationMr: string;
  designationHi: string;
  contact: string;
  wardNo?: string;
  orderIndex: number;
  roleDescriptionEn?: string;
  roleDescriptionMr?: string;
  roleDescriptionHi?: string;
  photoUrl?: string;
}

export interface VillageFacility {
  id: string;
  category: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  descEn?: string;
  descMr?: string;
  descHi?: string;
  phone?: string;
  mapUrl?: string;
}

export interface VillageStat {
  id: string;
  key: string;
  labelEn: string;
  labelMr: string;
  labelHi: string;
  value: string;
  category: string;
  icon?: string;
}

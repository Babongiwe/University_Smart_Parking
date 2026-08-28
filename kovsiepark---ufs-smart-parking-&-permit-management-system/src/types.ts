export type UserRole = 'student' | 'staff' | 'security' | 'admin' | 'visitor';

export type CampusLocation = 'Bloemfontein Main' | 'Qwaqwa Campus' | 'South Campus';

export type ZoneCategory = 
  | 'All Zone Categories'
  | 'Student Parking' 
  | 'Staff Parking' 
  | 'Visitor Parking' 
  | 'Disability Parking' 
  | 'Reserved Parking';

export type PermitCategory = 'student' | 'staff' | 'disability' | 'reserved' | 'visitor';

export type PermitStatus = 'active' | 'expired' | 'revoked' | 'pending';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // e.g. 2024098124 or UFS-STAFF-4891
  email: string;
  phone: string;
  faculty: string;
  department?: string;
  programme?: string;
  yearOfStudy?: string;
  avatarUrl?: string;
  alprClearance: {
    activePermitsCount: number;
    registeredPlatesCount: number;
    securityClearance: string; // e.g. "Good Standing (0 Fines)"
  };
}

export interface RegisteredVehicle {
  id: string;
  plate: string;
  makeModel: string;
  color: string;
  year: string;
  isPrimary: boolean;
  ownerId: string;
  readyForPermit: boolean;
}

export interface DigitalPermit {
  id: string;
  permitNumber: string; // e.g. "KP-2026-STU-1929"
  holderName: string;
  holderIdentifier: string;
  type: PermitCategory;
  assignedPlate: string;
  vehicleModel: string;
  campus: CampusLocation;
  authorizedZones: string; // e.g. "Student Parking", "Staff Parking"
  validFrom: string;
  validUntil: string;
  status: PermitStatus;
  paymentStatus: 'paid' | 'unpaid' | 'waived';
  feeAmount: number;
  qrCodeData: string;
}

export interface PermitApplication {
  id: string; // e.g. "APP-2026-9074"
  applicantName: string;
  applicantIdentifier: string;
  applicantEmail: string;
  role: 'Student' | 'Staff';
  permitCategory: PermitCategory;
  campus: CampusLocation;
  preferredZone: string;
  vehiclePlate: string;
  vehicleModel: string;
  reason?: string;
  submittedDate: string;
  status: ApplicationStatus;
  adminReviewNotes?: string;
  attachedProofFileName?: string;
  feeAmount: number;
  paymentStatus: 'paid' | 'pending_payment' | 'waived';
}

export interface ParkingBay {
  id: number;
  bayNumber: number;
  isOccupied: boolean;
  occupiedPlate?: string;
  reservedForVisitor?: string;
}

export interface ParkingZone {
  id: string;
  code: string; // e.g. "ZONE-A", "ZONE-B"
  name: string;
  campus: CampusLocation;
  category: ZoneCategory;
  locationDetails: string;
  occupiedBays: number;
  totalBays: number;
  status: 'Active' | 'Maintenance' | 'Full';
  permittedCategories: string[];
  bays: ParkingBay[];
  alprRules: string;
  hourlyRate?: number;
}

export interface VisitorReservation {
  id: string;
  referenceCode: string; // e.g. "VIS-2026-901"
  visitorName: string;
  visitorTitle?: string;
  visitorCategory: 'Guest Speaker / Academic Guest' | 'Contractor / Vendor' | 'Prospective Student / Family' | 'Official VIP Delegate';
  email: string;
  phone: string;
  licensePlate: string;
  vehicleModelColor: string;
  hostStaffName: string;
  hostDepartment: string;
  purposeOfVisit: string;
  destinationCampus: CampusLocation;
  visitDate: string;
  expectedArrival: string;
  expectedDeparture: string;
  allocatedZone: string;
  allocatedBay: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed';
  paymentStatus: 'Paid' | 'Complimentary / Host Funded';
  amount: number;
}

export interface GracePeriodTimer {
  id: string;
  plate: string;
  zoneScanned: string;
  initialSeconds: number;
  secondsRemaining: number;
  scannedTime: string;
  warningType: string;
  status: 'counting' | 'vacated' | 'cited';
}

export interface ViolationCitation {
  id: string;
  citationRef: string;
  licensePlate: string;
  vehicleDetails?: string;
  ownerName?: string;
  violationDetails: string;
  locationZone: string;
  fineAmount: number;
  status: 'fine_issued' | 'grace_period_active' | 'resolved' | 'settled_paid';
  timestamp: string;
  paymentReceipt?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'permit_approved' | 'permit_active' | 'grace_alert' | 'visitor_confirmed' | 'app_submitted' | 'fine_issued';
  read: boolean;
  targetRole?: UserRole | 'all';
}

export interface AlprScanLog {
  id: string;
  timestamp: string;
  licensePlate: string;
  zone: string;
  confidence: number;
  resultStatus: 'AUTHORIZED' | 'ACCESS RESTRICTED (HOLD)' | 'GRACE PERIOD INITIATED' | 'DENIED (UNREGISTERED)';
  gateAction: 'GATE OPENED' | 'BOOM GATE HOLD' | 'SECURITY DISPATCH';
  systemNotes: string;
}

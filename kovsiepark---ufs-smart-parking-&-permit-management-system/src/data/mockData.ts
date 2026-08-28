import { 
  UserProfile, 
  RegisteredVehicle, 
  DigitalPermit, 
  PermitApplication, 
  ParkingZone, 
  VisitorReservation, 
  GracePeriodTimer, 
  ViolationCitation, 
  SystemNotification, 
  AlprScanLog 
} from '../types';

export const INITIAL_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr-student-1',
    name: 'Babongiwe Magubane',
    role: 'student',
    identifier: '2024098124',
    email: 'student@ufs.ac.za',
    phone: '+27 82 555 1234',
    faculty: 'Faculty of Natural & Agricultural Sciences',
    department: 'Computer Science & Informatics',
    programme: 'BSc Computer Science',
    yearOfStudy: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    alprClearance: {
      activePermitsCount: 2,
      registeredPlatesCount: 1,
      securityClearance: 'Good Standing (0 Fines)'
    }
  },
  staff: {
    id: 'usr-staff-1',
    name: 'Prof. Annelize van der Merwe',
    role: 'staff',
    identifier: 'UFS-STAFF-4891',
    email: 'staff@ufs.ac.za',
    phone: '+27 83 291 8844',
    faculty: 'Faculty of Economic & Management Sciences',
    department: 'Business Management & Accounting',
    programme: 'Senior Academic Faculty',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    alprClearance: {
      activePermitsCount: 1,
      registeredPlatesCount: 1,
      securityClearance: 'Good Standing (0 Fines)'
    }
  },
  security: {
    id: 'usr-sec-1',
    name: 'Officer Sipho Dlamini',
    role: 'security',
    identifier: 'SEC-2024-007',
    email: 'security.command@ufs.ac.za',
    phone: '+27 51 401 2911',
    faculty: 'UFS Protection Services',
    department: 'Campus Security & ALPR Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    alprClearance: {
      activePermitsCount: 0,
      registeredPlatesCount: 0,
      securityClearance: 'Security Command Authorized'
    }
  },
  admin: {
    id: 'usr-adm-1',
    name: 'KovsiePark Control Center',
    role: 'admin',
    identifier: 'ADM-2024-001',
    email: 'admin.kovsiepark@ufs.ac.za',
    phone: '+27 51 401 9111',
    faculty: 'Directorate of Campus Operations',
    department: 'Traffic, Parking & Permit Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    alprClearance: {
      activePermitsCount: 4,
      registeredPlatesCount: 0,
      securityClearance: 'System Super Admin'
    }
  },
  visitor: {
    id: 'usr-vis-1',
    name: 'Dr. Lerato Khumalo',
    role: 'visitor',
    identifier: '9204155123088',
    email: 'lkhumalo@guest.ufs.ac.za',
    phone: '+27 83 195 1234',
    faculty: 'University Guest / Visitor',
    department: 'External Examiner & Guest Speaker',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    alprClearance: {
      activePermitsCount: 1,
      registeredPlatesCount: 1,
      securityClearance: 'Temporary Visitor Clearance'
    }
  }
};

export const INITIAL_VEHICLES: RegisteredVehicle[] = [
  {
    id: 'veh-1',
    plate: 'FSK 123 GP',
    makeModel: 'Volkswagen Polo Vivo 1.4',
    color: 'Silver',
    year: '2021',
    isPrimary: true,
    ownerId: '2024098124',
    readyForPermit: true
  },
  {
    id: 'veh-2',
    plate: 'BFN 889 FS',
    makeModel: 'Toyota Corolla Cross 1.8 Hybrid',
    color: 'Navy Blue',
    year: '2023',
    isPrimary: true,
    ownerId: 'UFS-STAFF-4891',
    readyForPermit: true
  }
];

export const INITIAL_PERMITS: DigitalPermit[] = [
  {
    id: 'pmt-1',
    permitNumber: 'KP-2026-STU-1929',
    holderName: 'Babongiwe Magubane',
    holderIdentifier: '2024098124',
    type: 'student',
    assignedPlate: 'FSK 123 GP',
    vehicleModel: 'Volkswagen Polo Vivo 1.4',
    campus: 'South Campus',
    authorizedZones: 'Student Parking',
    validFrom: '2026-06-27',
    validUntil: '2026-12-31',
    status: 'active',
    paymentStatus: 'paid',
    feeAmount: 450,
    qrCodeData: 'KOVSIEPARK:KP-2026-STU-1929::STUDENT:ACTIVE:FSK123GP'
  },
  {
    id: 'pmt-2',
    permitNumber: 'KP-2026-STU-0891',
    holderName: 'Babongiwe Magubane',
    holderIdentifier: '2024098124',
    type: 'student',
    assignedPlate: 'FSK 123 GP',
    vehicleModel: 'Volkswagen Polo Vivo 1.4',
    campus: 'Bloemfontein Main',
    authorizedZones: 'Student Parking',
    validFrom: '2026-02-01',
    validUntil: '2026-11-30',
    status: 'active',
    paymentStatus: 'paid',
    feeAmount: 450,
    qrCodeData: 'KOVSIEPARK:KP-2026-STU-0891::STUDENT:ACTIVE:FSK123GP'
  },
  {
    id: 'pmt-3',
    permitNumber: 'KP-2026-STF-0144',
    holderName: 'Prof. Annelize van der Merwe',
    holderIdentifier: 'UFS-STAFF-4891',
    type: 'staff',
    assignedPlate: 'BFN 889 FS',
    vehicleModel: 'Toyota Corolla Cross 1.8 Hybrid',
    campus: 'Bloemfontein Main',
    authorizedZones: 'Staff Parking & Admin Quad',
    validFrom: '2026-01-10',
    validUntil: '2026-12-31',
    status: 'active',
    paymentStatus: 'paid',
    feeAmount: 850,
    qrCodeData: 'KOVSIEPARK:KP-2026-STF-0144::STAFF:ACTIVE:BFN889FS'
  },
  {
    id: 'pmt-4',
    permitNumber: 'KP-2025-STU-0412',
    holderName: 'Lerato Ndlovu',
    holderIdentifier: '2023194021',
    type: 'student',
    assignedPlate: 'KVS 404 FS',
    vehicleModel: 'Ford Fiesta 1.0 EcoBoost',
    campus: 'Bloemfontein Main',
    authorizedZones: 'Student Parking',
    validFrom: '2025-02-01',
    validUntil: '2025-11-30',
    status: 'expired',
    paymentStatus: 'paid',
    feeAmount: 450,
    qrCodeData: 'KOVSIEPARK:KP-2025-STU-0412::STUDENT:EXPIRED:KVS404FS'
  },
  {
    id: 'pmt-5',
    permitNumber: 'KP-2026-RSV-0012',
    holderName: 'Kagiso Khumalo',
    holderIdentifier: 'UFS-ADMN-1200',
    type: 'reserved',
    assignedPlate: 'STAFF 001 FS',
    vehicleModel: 'BMW 330i M Sport',
    campus: 'Bloemfontein Main',
    authorizedZones: 'Executive & Vice-Chancellor Reserved',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    status: 'active',
    paymentStatus: 'waived',
    feeAmount: 1500,
    qrCodeData: 'KOVSIEPARK:KP-2026-RSV-0012::RESERVED:ACTIVE:STAFF001FS'
  }
];

export const INITIAL_APPLICATIONS: PermitApplication[] = [
  {
    id: 'APP-2026-9074',
    applicantName: 'Babongiwe Magubane',
    applicantIdentifier: '2024098124',
    applicantEmail: 'student@ufs.ac.za',
    role: 'Student',
    permitCategory: 'student',
    campus: 'South Campus',
    preferredZone: 'Student Parking',
    vehiclePlate: 'FSK 123 GP',
    vehicleModel: 'Volkswagen Polo Vivo 1.4',
    reason: 'Daily commuter attending computer lab sessions and practical lectures.',
    submittedDate: '2026-08-28',
    status: 'pending',
    adminReviewNotes: 'Pending administrative document verification',
    attachedProofFileName: 'UFS_Proof_Of_Reg_2026.pdf',
    feeAmount: 450,
    paymentStatus: 'paid'
  },
  {
    id: 'APP-2026-4629',
    applicantName: 'Babongiwe Magubane',
    applicantIdentifier: '2024098124',
    applicantEmail: 'student@ufs.ac.za',
    role: 'Student',
    permitCategory: 'student',
    campus: 'Bloemfontein Main',
    preferredZone: 'Student Parking',
    vehiclePlate: 'FSK 123 GP',
    vehicleModel: 'Volkswagen Polo Vivo 1.4',
    reason: 'Standard semester parking access for main campus library & lectures.',
    submittedDate: '2026-08-27',
    status: 'approved',
    adminReviewNotes: 'Verified and approved by Administrator.',
    attachedProofFileName: 'Proof_Of_Registration_Magubane.pdf',
    feeAmount: 450,
    paymentStatus: 'paid'
  },
  {
    id: 'APP-2026-8104',
    applicantName: 'Lerato Ndlovu',
    applicantIdentifier: '2023194021',
    applicantEmail: 'leratondlovu@ufs.ac.za',
    role: 'Student',
    permitCategory: 'student',
    campus: 'Bloemfontein Main',
    preferredZone: 'Student Parking',
    vehiclePlate: 'KVS 404 FS',
    vehicleModel: 'Ford Fiesta 1.0 EcoBoost',
    reason: 'Renewal application for academic year 2026.',
    submittedDate: '2026-08-25',
    status: 'pending',
    adminReviewNotes: 'Awaiting updated vehicle proof of ownership',
    attachedProofFileName: 'Vehicle_Licence_Disk.pdf',
    feeAmount: 450,
    paymentStatus: 'pending_payment'
  }
];

function generateBays(count: number, occupiedIndices: number[]): { id: number; bayNumber: number; isOccupied: boolean; occupiedPlate?: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const bayNum = i + 1;
    const isOccupied = occupiedIndices.includes(bayNum);
    return {
      id: bayNum,
      bayNumber: bayNum,
      isOccupied,
      occupiedPlate: isOccupied ? `FSK ${100 + bayNum} GP` : undefined
    };
  });
}

export const INITIAL_ZONES: ParkingZone[] = [
  {
    id: 'zone-a',
    code: 'ZONE-A',
    name: 'Main Building & Admin Quad',
    campus: 'Bloemfontein Main',
    category: 'Staff Parking',
    locationDetails: 'North Quadrangle, adjacent to Main Administration Building & Flippie Groenewoud Building',
    occupiedBays: 88,
    totalBays: 120,
    status: 'Active',
    permittedCategories: ['STAFF PERMITS', 'RESERVED PERMITS'],
    bays: generateBays(24, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]),
    alprRules: 'Only vehicles possessing an active permit under Staff or Reserved categories are granted automated entry. Any other vehicle scanning at boom gates enters an immediate 15-minute grace period countdown before a citation is lodged.',
    hourlyRate: 0
  },
  {
    id: 'zone-b',
    code: 'ZONE-B',
    name: 'Student Center & Library West',
    campus: 'Bloemfontein Main',
    category: 'Student Parking',
    locationDetails: 'West Campus Promenade, near Sasol Library & Thakaneng Student Center',
    occupiedBays: 295,
    totalBays: 350,
    status: 'Active',
    permittedCategories: ['STUDENT PERMITS', 'DISABILITY PERMITS'],
    bays: generateBays(24, [1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23]),
    alprRules: 'Open to active student permits. Students with registered tags have automated boom lift. Non-permit holders may park for a maximum of 30 minutes drop-off.',
    hourlyRate: 0
  },
  {
    id: 'zone-c',
    code: 'ZONE-C',
    name: 'Callie Human Center & Sports Complex',
    campus: 'Bloemfontein Main',
    category: 'Student Parking',
    locationDetails: 'South-East Precinct, adjacent to Callie Human Hall & Athletics Stadium',
    occupiedBays: 140,
    totalBays: 280,
    status: 'Active',
    permittedCategories: ['STUDENT PERMITS', 'STAFF PERMITS', 'VISITOR PERMITS'],
    bays: generateBays(24, [1, 2, 3, 4, 7, 8, 9, 10, 15, 16, 17, 18]),
    alprRules: 'Flexible mixed-use zone. Accommodates overflow student, staff, and event attendee parking.',
    hourlyRate: 15
  },
  {
    id: 'zone-v1',
    code: 'ZONE-V1',
    name: 'Visitor Gateway & Welcome Center',
    campus: 'Bloemfontein Main',
    category: 'Visitor Parking',
    locationDetails: 'Nelson Mandela Drive Main Entrance Gate, Visitors Registration Pavilion',
    occupiedBays: 42,
    totalBays: 60,
    status: 'Active',
    permittedCategories: ['VISITOR PASSES', 'TEMPORARY CLEARANCE'],
    bays: generateBays(20, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19]),
    alprRules: 'Pre-registered visitors receive instant optical clearance. Unregistered visitors must proceed to the Visitors Centre booth for manual verification.',
    hourlyRate: 25
  },
  {
    id: 'zone-d1',
    code: 'ZONE-D1',
    name: 'Accessible / Disability Concourse',
    campus: 'Bloemfontein Main',
    category: 'Disability Parking',
    locationDetails: 'Ground-level reserved bays adjacent to CUADS Center & Exam Halls',
    occupiedBays: 11,
    totalBays: 24,
    status: 'Active',
    permittedCategories: ['CUADS DISABILITY PERMITS'],
    bays: generateBays(16, [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15]),
    alprRules: 'Strictly restricted to vehicles verified with UFS Centre for Universal Access and Disability Support (CUADS). Instant fine R500 for unauthorized vehicles.',
    hourlyRate: 0
  },
  {
    id: 'zone-exec',
    code: 'ZONE-EXEC',
    name: 'Executive & Vice-Chancellor Reserved',
    campus: 'Bloemfontein Main',
    category: 'Reserved Parking',
    locationDetails: 'Executive Office Enclosure, South Wing',
    occupiedBays: 28,
    totalBays: 32,
    status: 'Active',
    permittedCategories: ['RESERVED EXECUTIVE PASSES'],
    bays: generateBays(16, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    alprRules: 'Dedicated executive personnel. 24/7 dedicated surveillance and enforcement.',
    hourlyRate: 0
  }
];

export const INITIAL_VISITORS: VisitorReservation[] = [
  {
    id: 'vis-1',
    referenceCode: 'VIS-2026-901',
    visitorName: 'Dr. Lerato Khumalo',
    visitorTitle: 'Guest Speaker / Academic Guest',
    visitorCategory: 'Guest Speaker / Academic Guest',
    email: 'lkhumalo@guest.ufs.ac.za',
    phone: '+27 83 195 1234',
    licensePlate: 'HJK 552 FS',
    vehicleModelColor: 'Hyundai Tucson (Silver)',
    hostStaffName: 'Prof. A. Van Der Merwe',
    hostDepartment: 'Computer Science & Informatics',
    purposeOfVisit: 'External Examiner for Honours Software Engineering Presentations',
    destinationCampus: 'Bloemfontein Main',
    visitDate: '2026-08-30',
    expectedArrival: '09:00',
    expectedDeparture: '15:00',
    allocatedZone: 'Zone Z-03 Visitor Lot',
    allocatedBay: 14,
    status: 'Confirmed',
    paymentStatus: 'Complimentary / Host Funded',
    amount: 0
  },
  {
    id: 'vis-2',
    referenceCode: 'VIS-2026-882',
    visitorName: 'Dr. Michael Petersen',
    visitorTitle: 'Guest Lecturer',
    visitorCategory: 'Guest Speaker / Academic Guest',
    email: 'mpetersen@consulting.co.za',
    phone: '+27 72 441 9002',
    licensePlate: 'CAA 981 22',
    vehicleModelColor: 'Audi A4 (Black)',
    hostStaffName: 'Prof. Annelize van der Merwe',
    hostDepartment: 'Faculty of Economic & Management Sciences',
    purposeOfVisit: 'Postgraduate guest lecture on Public Financial Management',
    destinationCampus: 'Bloemfontein Main',
    visitDate: '2026-08-31',
    expectedArrival: '10:00',
    expectedDeparture: '14:00',
    allocatedZone: 'Zone V1 Visitor Gateway',
    allocatedBay: 8,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    amount: 50
  }
];

export const INITIAL_GRACE_PERIODS: GracePeriodTimer[] = [
  {
    id: 'grace-1',
    plate: 'FSK 123 GP',
    zoneScanned: 'South Campus Staff & Visitor Gateway (Staff Parking)',
    initialSeconds: 900,
    secondsRemaining: 900,
    scannedTime: '18:39',
    warningType: 'Unauthorized in Staff Zone (Student Permit Detected)',
    status: 'counting'
  },
  {
    id: 'grace-2',
    plate: 'FSK 123 GP',
    zoneScanned: 'Accessible / Disability Concourse (Disability Parking)',
    initialSeconds: 900,
    secondsRemaining: 900,
    scannedTime: '18:38',
    warningType: 'Unauthorized in Disability Concourse without CUADS permit',
    status: 'counting'
  }
];

export const INITIAL_VIOLATIONS: ViolationCitation[] = [
  {
    id: 'cit-1',
    citationRef: 'CIT-2026-081',
    licensePlate: 'KVS 404 FS',
    vehicleDetails: 'Ford Fiesta (White)',
    ownerName: 'Lerato Ndlovu (2023194021)',
    violationDetails: 'Parking with expired student permit in Zone B after 15m courtesy grace elapsed',
    locationZone: 'Student Center & Library West',
    fineAmount: 350,
    status: 'fine_issued',
    timestamp: '2026-08-27 11:20'
  },
  {
    id: 'cit-2',
    citationRef: 'CIT-2026-094',
    licensePlate: 'CA 771 902',
    vehicleDetails: 'BMW 1 Series (Blue)',
    ownerName: 'Unregistered Driver',
    violationDetails: 'Unauthorized parking in Accessible / Disability Concourse (Zone D1)',
    locationZone: 'Accessible / Disability Concourse',
    fineAmount: 500,
    status: 'fine_issued',
    timestamp: '2026-08-27 14:05'
  },
  {
    id: 'cit-3',
    citationRef: 'CIT-2026-062',
    licensePlate: 'ABC 999 FS',
    vehicleDetails: 'Toyota Hilux (White)',
    ownerName: 'Staff Member J. Coetzee',
    violationDetails: 'Temporary obstruction at Main Building Quad loading ramp',
    locationZone: 'Main Building & Admin Quad',
    fineAmount: 0,
    status: 'resolved',
    timestamp: '2026-08-26 09:12'
  },
  {
    id: 'cit-4',
    citationRef: 'CIT-2026-055',
    licensePlate: 'BFN 102 FS',
    vehicleDetails: 'Renault Clio (Red)',
    ownerName: 'Visitor M. Sithole',
    violationDetails: 'Exceeded visitor temporary parking duration',
    locationZone: 'Visitor Gateway & Welcome Center',
    fineAmount: 0,
    status: 'resolved',
    timestamp: '2026-08-25 16:30'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Parking Permit Approved!',
    message: 'Your parking permit application (APP-2026-4629) for vehicle FSK 123 GP has been approved. Your digital permit is now active.',
    timestamp: '18:35',
    type: 'permit_approved',
    read: false,
    targetRole: 'student'
  },
  {
    id: 'notif-2',
    title: 'Parking Permit Active & Valid',
    message: 'Your 2026 Student Parking Permit (KP-2026-STU-0891) for vehicle FSK 123 GP is active for Bloemfontein Main Campus.',
    timestamp: '08:00',
    type: 'permit_active',
    read: false,
    targetRole: 'student'
  },
  {
    id: 'notif-3',
    title: 'ALPR Alert: Grace Period Active',
    message: 'Unauthorized vehicle FSK 123 GP detected in South Campus Staff & Visitor Gateway. 15-minute grace period active.',
    timestamp: '18:39',
    type: 'grace_alert',
    read: false,
    targetRole: 'security'
  },
  {
    id: 'notif-4',
    title: 'ALPR Alert: Grace Period Active',
    message: 'Unauthorized vehicle FSK 123 GP detected in Accessible / Disability Concourse. 15-minute grace period active.',
    timestamp: '18:38',
    type: 'grace_alert',
    read: false,
    targetRole: 'security'
  },
  {
    id: 'notif-5',
    title: 'New Permit Application Submitted',
    message: 'Babongiwe Magubane (2024098124) submitted a STUDENT permit application for vehicle FSK 123 GP.',
    timestamp: '05:34',
    type: 'app_submitted',
    read: false,
    targetRole: 'admin'
  },
  {
    id: 'notif-6',
    title: 'Visitor Reservation Confirmed',
    message: 'Dr. Lerato Khumalo (Guest Speaker / Academic Guest) reserved Bay 14 in Zone Z-03 Visitor Lot for 2026-08-30.',
    timestamp: '05:25',
    type: 'visitor_confirmed',
    read: false,
    targetRole: 'admin'
  }
];

export const INITIAL_ALPR_LOGS: AlprScanLog[] = [
  {
    id: 'scan-1',
    timestamp: '18:42:10',
    licensePlate: 'FSK 123 GP',
    zone: 'South Campus Staff & Visitor Gateway',
    confidence: 98.7,
    resultStatus: 'GRACE PERIOD INITIATED',
    gateAction: 'BOOM GATE HOLD',
    systemNotes: 'Student Permit holder entered Staff Restricted Zone. 15-min courtesy countdown initiated.'
  },
  {
    id: 'scan-2',
    timestamp: '18:38:05',
    licensePlate: 'FSK 123 GP',
    zone: 'Accessible / Disability Concourse',
    confidence: 99.2,
    resultStatus: 'GRACE PERIOD INITIATED',
    gateAction: 'BOOM GATE HOLD',
    systemNotes: 'No CUADS disability tag registered. Security alert dispatched.'
  },
  {
    id: 'scan-3',
    timestamp: '18:30:12',
    licensePlate: 'BFN 889 FS',
    zone: 'Main Building & Admin Quad',
    confidence: 99.8,
    resultStatus: 'AUTHORIZED',
    gateAction: 'GATE OPENED',
    systemNotes: 'Valid Staff Permit KP-2026-STF-0144 matched. Automated boom lift executed.'
  },
  {
    id: 'scan-4',
    timestamp: '18:15:40',
    licensePlate: 'HJK 552 FS',
    zone: 'Visitor Gateway & Welcome Center',
    confidence: 97.9,
    resultStatus: 'AUTHORIZED',
    gateAction: 'GATE OPENED',
    systemNotes: 'Valid Pre-Registered Visitor Pass VIS-2026-901 matched. Allocated to Bay 14.'
  },
  {
    id: 'scan-5',
    timestamp: '17:50:22',
    licensePlate: 'KVS 404 FS',
    zone: 'Student Center & Library West',
    confidence: 98.4,
    resultStatus: 'ACCESS RESTRICTED (HOLD)',
    gateAction: 'BOOM GATE HOLD',
    systemNotes: 'Expired permit KP-2025-STU-0412. Prompted to renew in KovsiePark portal.'
  }
];

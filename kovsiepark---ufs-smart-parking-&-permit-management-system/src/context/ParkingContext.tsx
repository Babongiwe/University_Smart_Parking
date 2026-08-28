import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  RegisteredVehicle, 
  DigitalPermit, 
  PermitApplication, 
  ParkingZone, 
  VisitorReservation, 
  GracePeriodTimer, 
  ViolationCitation, 
  SystemNotification, 
  AlprScanLog,
  CampusLocation,
  PermitCategory
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_VEHICLES, 
  INITIAL_PERMITS, 
  INITIAL_APPLICATIONS, 
  INITIAL_ZONES, 
  INITIAL_VISITORS, 
  INITIAL_GRACE_PERIODS, 
  INITIAL_VIOLATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ALPR_LOGS 
} from '../data/mockData';

interface ParkingContextType {
  // Auth & Roles
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole, identifier?: string, customName?: string) => void;
  registerVisitorAccount: (data: { name: string; surname: string; idNumber: string; password?: string }) => void;
  registeredVisitors: { name: string; surname: string; idNumber: string; password?: string }[];
  logout: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;

  // Permits & Applications
  permits: DigitalPermit[];
  applications: PermitApplication[];
  submitApplication: (data: Omit<PermitApplication, 'id' | 'submittedDate' | 'status' | 'feeAmount' | 'paymentStatus'>) => void;
  approveApplication: (appId: string, notes?: string) => void;
  rejectApplication: (appId: string, notes?: string) => void;
  renewPermit: (permitId: string) => void;

  // Vehicles
  vehicles: RegisteredVehicle[];
  registerVehicle: (veh: Omit<RegisteredVehicle, 'id' | 'readyForPermit'>) => void;

  // Zones & Real-time Bays
  zones: ParkingZone[];
  activeCampus: CampusLocation | 'All Campuses';
  setActiveCampus: (campus: CampusLocation | 'All Campuses') => void;
  simulateGateSensor: (zoneId: string, delta: number) => void;
  toggleBayStatus: (zoneId: string, bayNumber: number) => void;
  updateZoneRules: (zoneId: string, newRules: string) => void;

  // Visitor Parking
  visitors: VisitorReservation[];
  createVisitorReservation: (reservation: Omit<VisitorReservation, 'id' | 'referenceCode' | 'status'>) => VisitorReservation;
  cancelVisitorReservation: (refCode: string) => boolean;

  // Security & Grace Periods
  gracePeriods: GracePeriodTimer[];
  dismissGracePeriod: (id: string) => void;
  citeGracePeriod: (id: string, amount?: number) => void;

  // Citations & Violations
  violations: ViolationCitation[];
  issueCitation: (data: Omit<ViolationCitation, 'id' | 'citationRef' | 'timestamp' | 'status'>) => void;
  settleFine: (citationId: string, method: string) => void;

  // ALPR Scanner Simulation
  alprLogs: AlprScanLog[];
  runAlprScan: (plate: string, zoneName: string) => {
    status: 'AUTHORIZED' | 'ACCESS RESTRICTED (HOLD)' | 'GRACE PERIOD INITIATED' | 'DENIED (UNREGISTERED)';
    action: 'GATE OPENED' | 'BOOM GATE HOLD' | 'SECURITY DISPATCH';
    message: string;
    matchedPermit?: DigitalPermit;
    matchedVisitor?: VisitorReservation;
  };

  // Notifications
  notifications: SystemNotification[];
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: SystemNotification['type'], targetRole?: UserRole | 'all') => void;

  // Active View & Modals
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  isKovsieBotOpen: boolean;
  setIsKovsieBotOpen: (open: boolean) => void;
  isSupportDeskOpen: boolean;
  setIsSupportDeskOpen: (open: boolean) => void;
  selectedPermitForModal: DigitalPermit | null;
  setSelectedPermitForModal: (permit: DigitalPermit | null) => void;
  selectedVisitorForModal: VisitorReservation | null;
  setSelectedVisitorForModal: (visitor: VisitorReservation | null) => void;
  isApplyPermitModalOpen: boolean;
  setIsApplyPermitModalOpen: (open: boolean) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  pendingPaymentDetails: { title: string; amount: number; reference: string; onComplete?: () => void } | null;
  setPendingPaymentDetails: (details: { title: string; amount: number; reference: string; onComplete?: () => void } | null) => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS.student);
  
  const [permits, setPermits] = useState<DigitalPermit[]>(INITIAL_PERMITS);
  const [applications, setApplications] = useState<PermitApplication[]>(INITIAL_APPLICATIONS);
  const [vehicles, setVehicles] = useState<RegisteredVehicle[]>(INITIAL_VEHICLES);
  const [zones, setZones] = useState<ParkingZone[]>(INITIAL_ZONES);
  const [visitors, setVisitors] = useState<VisitorReservation[]>(INITIAL_VISITORS);
  const [gracePeriods, setGracePeriods] = useState<GracePeriodTimer[]>(INITIAL_GRACE_PERIODS);
  const [violations, setViolations] = useState<ViolationCitation[]>(INITIAL_VIOLATIONS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [alprLogs, setAlprLogs] = useState<AlprScanLog[]>(INITIAL_ALPR_LOGS);

  const [activeCampus, setActiveCampus] = useState<CampusLocation | 'All Campuses'>('All Campuses');
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');
  
  // Modals
  const [isKovsieBotOpen, setIsKovsieBotOpen] = useState<boolean>(false);
  const [isSupportDeskOpen, setIsSupportDeskOpen] = useState<boolean>(false);
  const [selectedPermitForModal, setSelectedPermitForModal] = useState<DigitalPermit | null>(null);
  const [selectedVisitorForModal, setSelectedVisitorForModal] = useState<VisitorReservation | null>(null);
  const [isApplyPermitModalOpen, setIsApplyPermitModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [pendingPaymentDetails, setPendingPaymentDetails] = useState<{ title: string; amount: number; reference: string; onComplete?: () => void } | null>(null);

  const [registeredVisitors, setRegisteredVisitors] = useState<{ name: string; surname: string; idNumber: string; password?: string }[]>([
    { name: 'Dr. Lerato', surname: 'Khumalo', idNumber: '9204155123088', password: 'password123' }
  ]);

  // Sync user profile when role changes
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (INITIAL_USERS[role]) {
      setCurrentUser(INITIAL_USERS[role]);
    }
    setActiveNavTab('dashboard');
  };

  const registerVisitorAccount = (data: { name: string; surname: string; idNumber: string; password?: string }) => {
    setRegisteredVisitors((prev) => [data, ...prev]);
    addNotification(
      'Visitor Account Created',
      `Welcome ${data.name} ${data.surname}! Your KovsiePark visitor account has been successfully created.`,
      'permit_active',
      'visitor'
    );
  };

  const login = (role: UserRole, identifier?: string, customName?: string) => {
    setCurrentRoleState(role);
    if (role === 'visitor') {
      const matched = registeredVisitors.find(v => v.idNumber === identifier);
      const visitorFullName = customName || (matched ? `${matched.name} ${matched.surname}` : 'Dr. Lerato Khumalo');
      setCurrentUser({
        id: `usr-vis-${Date.now()}`,
        name: visitorFullName,
        role: 'visitor',
        identifier: identifier || '9204155123088',
        email: `${visitorFullName.toLowerCase().replace(/\s+/g, '.')}@guest.ufs.ac.za`,
        phone: '+27 83 195 1234',
        faculty: 'University Guest / Visitor',
        department: 'External Visitor Access',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        alprClearance: {
          activePermitsCount: 1,
          registeredPlatesCount: 1,
          securityClearance: 'Temporary Visitor Clearance'
        }
      });
    } else if (INITIAL_USERS[role]) {
      setCurrentUser({
        ...INITIAL_USERS[role],
        identifier: identifier || INITIAL_USERS[role].identifier,
        ...(customName ? { name: customName } : {})
      });
    }
    setIsAuthenticated(true);
    setActiveNavTab('dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
    addNotification('Profile Updated', 'Your profile details were updated successfully.', 'permit_active', currentUser.role);
  };

  // Add Notification helper
  const addNotification = (title: string, message: string, type: SystemNotification['type'], targetRole: UserRole | 'all' = 'all') => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      read: false,
      targetRole
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 1-second interval for grace period countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setGracePeriods((prev) =>
        prev.map((gp) => {
          if (gp.status === 'counting' && gp.secondsRemaining > 0) {
            return { ...gp, secondsRemaining: gp.secondsRemaining - 1 };
          }
          return gp;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Submit Permit Application
  const submitApplication = (data: Omit<PermitApplication, 'id' | 'submittedDate' | 'status' | 'feeAmount' | 'paymentStatus'>) => {
    const appId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = data.permitCategory === 'staff' ? 850 : 450;
    const newApp: PermitApplication = {
      ...data,
      id: appId,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      feeAmount: fee,
      paymentStatus: 'paid',
      attachedProofFileName: data.attachedProofFileName || 'Proof_Of_Registration.pdf'
    };

    setApplications((prev) => [newApp, ...prev]);
    
    // Notifications to student & admin
    addNotification(
      'Permit Application Submitted',
      `Your application ${appId} for vehicle ${data.vehiclePlate} has been recorded and sent for admin review.`,
      'app_submitted',
      'student'
    );
    addNotification(
      'New Permit Application in Queue',
      `${data.applicantName} (${data.applicantIdentifier}) submitted ${data.permitCategory.toUpperCase()} permit application.`,
      'app_submitted',
      'admin'
    );
  };

  // Approve Permit Application
  const approveApplication = (appId: string, notes = 'Verified and approved by Administrator.') => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'approved', adminReviewNotes: notes } : a))
    );

    // Auto issue permit
    const newPermitNum = `KP-2026-${app.permitCategory === 'staff' ? 'STF' : 'STU'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPermit: DigitalPermit = {
      id: `pmt-${Date.now()}`,
      permitNumber: newPermitNum,
      holderName: app.applicantName,
      holderIdentifier: app.applicantIdentifier,
      type: app.permitCategory,
      assignedPlate: app.vehiclePlate,
      vehicleModel: app.vehicleModel,
      campus: app.campus,
      authorizedZones: app.preferredZone || (app.permitCategory === 'staff' ? 'Staff Parking & Admin Quad' : 'Student Parking'),
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '2026-12-31',
      status: 'active',
      paymentStatus: 'paid',
      feeAmount: app.feeAmount,
      qrCodeData: `KOVSIEPARK:${newPermitNum}::${app.permitCategory.toUpperCase()}:ACTIVE:${app.vehiclePlate.replace(/\s+/g, '')}`
    };

    setPermits((prev) => [newPermit, ...prev]);

    // Send Approval notification
    addNotification(
      'Parking Permit Approved!',
      `Your parking permit application (${appId}) for vehicle ${app.vehiclePlate} has been approved. Your digital permit (${newPermitNum}) is now active.`,
      'permit_approved',
      'student'
    );
  };

  // Reject Permit Application
  const rejectApplication = (appId: string, notes = 'Application rejected. Please check documentation.') => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected', adminReviewNotes: notes } : a))
    );
    addNotification(
      'Permit Application Rejected',
      `Your application ${appId} was rejected by administration. Reason: ${notes}`,
      'app_submitted',
      'student'
    );
  };

  // Renew Permit
  const renewPermit = (permitId: string) => {
    const pmt = permits.find((p) => p.id === permitId);
    if (!pmt) return;

    setPermits((prev) =>
      prev.map((p) =>
        p.id === permitId
          ? {
              ...p,
              status: 'active',
              validUntil: '2026-12-31',
              validFrom: new Date().toISOString().split('T')[0]
            }
          : p
      )
    );

    addNotification(
      'Permit Renewed Successfully',
      `Permit ${pmt.permitNumber} has been renewed and is valid until 2026-12-31.`,
      'permit_active',
      pmt.type === 'staff' ? 'staff' : 'student'
    );
  };

  // Register New Vehicle
  const registerVehicle = (veh: Omit<RegisteredVehicle, 'id' | 'readyForPermit'>) => {
    const newVeh: RegisteredVehicle = {
      ...veh,
      id: `veh-${Date.now()}`,
      readyForPermit: true
    };
    setVehicles((prev) => [newVeh, ...prev]);
    addNotification(
      'Vehicle Registered',
      `Vehicle ${veh.plate} (${veh.makeModel}) successfully added to your profile.`,
      'permit_active',
      currentRole
    );
  };

  // Zones & Gate Sensor triggers
  const simulateGateSensor = (zoneId: string, delta: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const newOccupied = Math.max(0, Math.min(z.totalBays, z.occupiedBays + delta));
          return { ...z, occupiedBays: newOccupied };
        }
        return z;
      })
    );
  };

  const toggleBayStatus = (zoneId: string, bayNumber: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          let delta = 0;
          const updatedBays = z.bays.map((b) => {
            if (b.bayNumber === bayNumber) {
              const nextState = !b.isOccupied;
              delta = nextState ? 1 : -1;
              return {
                ...b,
                isOccupied: nextState,
                occupiedPlate: nextState ? 'FSK 123 GP' : undefined
              };
            }
            return b;
          });
          return {
            ...z,
            occupiedBays: Math.max(0, Math.min(z.totalBays, z.occupiedBays + delta)),
            bays: updatedBays
          };
        }
        return z;
      })
    );
  };

  const updateZoneRules = (zoneId: string, newRules: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, alprRules: newRules } : z))
    );
    addNotification('Parking Zone Rules Updated', 'ALPR access rules updated for zone.', 'grace_alert', 'admin');
  };

  // Visitor Pre-Registration
  const createVisitorReservation = (data: Omit<VisitorReservation, 'id' | 'referenceCode' | 'status'>): VisitorReservation => {
    const refCode = `VIS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReservation: VisitorReservation = {
      ...data,
      id: `vis-${Date.now()}`,
      referenceCode: refCode,
      status: 'Confirmed'
    };

    setVisitors((prev) => [newReservation, ...prev]);

    // Also mark the specific bay in Visitor Gateway / Zone as occupied or reserved
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === 'zone-v1') {
          return {
            ...z,
            bays: z.bays.map((b) =>
              b.bayNumber === data.allocatedBay
                ? { ...b, isOccupied: true, reservedForVisitor: refCode, occupiedPlate: data.licensePlate }
                : b
            )
          };
        }
        return z;
      })
    );

    addNotification(
      'Visitor Reservation Confirmed',
      `${data.visitorName} (${data.visitorCategory}) reserved Bay ${data.allocatedBay} in ${data.allocatedZone} for ${data.visitDate}.`,
      'visitor_confirmed',
      'admin'
    );

    return newReservation;
  };

  const cancelVisitorReservation = (refCode: string) => {
    const reservation = visitors.find((v) => v.referenceCode.toUpperCase() === refCode.toUpperCase());
    if (!reservation) return false;

    setVisitors((prev) =>
      prev.map((v) => (v.referenceCode.toUpperCase() === refCode.toUpperCase() ? { ...v, status: 'Cancelled' } : v))
    );

    addNotification(
      'Visitor Reservation Cancelled',
      `Reservation ${refCode} for ${reservation.visitorName} has been cancelled.`,
      'visitor_confirmed',
      'admin'
    );
    return true;
  };

  // Grace Period Dismissal / Citation
  const dismissGracePeriod = (id: string) => {
    const item = gracePeriods.find((g) => g.id === id);
    if (!item) return;

    setGracePeriods((prev) => prev.filter((g) => g.id !== id));
    
    // Add citation resolution record
    const resolvedCitation: ViolationCitation = {
      id: `cit-res-${Date.now()}`,
      citationRef: `CIT-RES-${Math.floor(1000 + Math.random() * 9000)}`,
      licensePlate: item.plate,
      vehicleDetails: 'Monitored Vehicle',
      ownerName: 'Dismissed on Departure',
      violationDetails: `Courtesy window concluded: ${item.warningType}. Vehicle vacated bay peacefully.`,
      locationZone: item.zoneScanned,
      fineAmount: 0,
      status: 'resolved',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setViolations((prev) => [resolvedCitation, ...prev]);

    addNotification(
      'Grace Period Resolved (Vehicle Vacated)',
      `Vehicle ${item.plate} left ${item.zoneScanned} within courtesy duration. No fine issued.`,
      'grace_alert',
      'security'
    );
  };

  const citeGracePeriod = (id: string, amount = 350) => {
    const item = gracePeriods.find((g) => g.id === id);
    if (!item) return;

    setGracePeriods((prev) => prev.filter((g) => g.id !== id));

    const citRef = `CIT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newCitation: ViolationCitation = {
      id: `cit-${Date.now()}`,
      citationRef: citRef,
      licensePlate: item.plate,
      vehicleDetails: 'Flagged Plate in Restricted Zone',
      ownerName: item.plate === 'FSK 123 GP' ? 'Babongiwe Magubane' : 'Campus Motorist',
      violationDetails: `${item.warningType} - 15m courtesy window expired`,
      locationZone: item.zoneScanned,
      fineAmount: amount,
      status: 'fine_issued',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setViolations((prev) => [newCitation, ...prev]);

    addNotification(
      'Parking Fine Issued (R' + amount + ')',
      `Official citation ${citRef} (R${amount}) lodged against vehicle ${item.plate} at ${item.zoneScanned}.`,
      'fine_issued',
      'security'
    );

    if (item.plate === 'FSK 123 GP') {
      addNotification(
        'Parking Violation Notice Issued',
        `A parking fine of R${amount} was issued for unauthorized parking in ${item.zoneScanned}. Please settle within 14 days.`,
        'fine_issued',
        'student'
      );
    }
  };

  // Issue General Citation
  const issueCitation = (data: Omit<ViolationCitation, 'id' | 'citationRef' | 'timestamp' | 'status'>) => {
    const citRef = `CIT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newCit: ViolationCitation = {
      ...data,
      id: `cit-${Date.now()}`,
      citationRef: citRef,
      status: 'fine_issued',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setViolations((prev) => [newCit, ...prev]);
    addNotification('New Citation Issued', `Citation ${citRef} recorded against ${data.licensePlate}.`, 'fine_issued', 'security');
  };

  // Settle Fine
  const settleFine = (citationId: string, method = 'Credit Card') => {
    const receiptNum = `REC-UFS-${Date.now().toString().slice(-6)}`;
    setViolations((prev) =>
      prev.map((v) =>
        v.id === citationId
          ? {
              ...v,
              status: 'settled_paid',
              paymentReceipt: `${receiptNum} (Settled via ${method})`
            }
          : v
      )
    );
    addNotification('Fine Payment Processed', `Receipt ${receiptNum} issued. Violation fine settled in full.`, 'permit_active', 'student');
  };

  // ALPR Optical Scanner Simulator Logic
  const runAlprScan = (plate: string, zoneName: string) => {
    const cleanPlate = plate.trim().toUpperCase();
    const activePermit = permits.find(
      (p) => p.assignedPlate.replace(/\s+/g, '') === cleanPlate.replace(/\s+/g, '') && p.status === 'active'
    );
    const expiredPermit = permits.find(
      (p) => p.assignedPlate.replace(/\s+/g, '') === cleanPlate.replace(/\s+/g, '') && p.status === 'expired'
    );
    const visitorPass = visitors.find(
      (v) => v.licensePlate.replace(/\s+/g, '') === cleanPlate.replace(/\s+/g, '') && v.status === 'Confirmed'
    );

    let resultStatus: AlprScanLog['resultStatus'] = 'DENIED (UNREGISTERED)';
    let gateAction: AlprScanLog['gateAction'] = 'BOOM GATE HOLD';
    let message = 'Unregistered vehicle. No active permit or visitor pass on record.';

    // Check staff permit in staff zone
    if (activePermit) {
      if (zoneName.includes('Staff') && activePermit.type === 'student') {
        resultStatus = 'GRACE PERIOD INITIATED';
        gateAction = 'BOOM GATE HOLD';
        message = `Zone Mismatch! Student permit holder (${activePermit.holderName}) entered Staff Restricted Zone. 15-minute grace period active.`;
        
        // Push grace period
        setGracePeriods((prev) => [
          {
            id: `grace-${Date.now()}`,
            plate: cleanPlate,
            zoneScanned: zoneName,
            initialSeconds: 900,
            secondsRemaining: 900,
            scannedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            warningType: 'Student permit scanning at Staff Restricted gate',
            status: 'counting'
          },
          ...prev
        ]);
      } else {
        resultStatus = 'AUTHORIZED';
        gateAction = 'GATE OPENED';
        message = `Valid ${activePermit.type.toUpperCase()} permit (${activePermit.permitNumber}) for ${activePermit.holderName}. Gate opening.`;
      }
    } else if (visitorPass) {
      resultStatus = 'AUTHORIZED';
      gateAction = 'GATE OPENED';
      message = `Pre-Registered Visitor pass ${visitorPass.referenceCode} (${visitorPass.visitorName}). Assigned to Bay ${visitorPass.allocatedBay}.`;
    } else if (expiredPermit) {
      resultStatus = 'ACCESS RESTRICTED (HOLD)';
      gateAction = 'BOOM GATE HOLD';
      message = `Permit ${expiredPermit.permitNumber} EXPIRED on ${expiredPermit.validUntil}. Access restricted.`;
      
      setGracePeriods((prev) => [
        {
          id: `grace-${Date.now()}`,
          plate: cleanPlate,
          zoneScanned: zoneName,
          initialSeconds: 900,
          secondsRemaining: 900,
          scannedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          warningType: `Expired Permit ${expiredPermit.permitNumber}`,
          status: 'counting'
        },
        ...prev
      ]);
    }

    const newLog: AlprScanLog = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      licensePlate: cleanPlate,
      zone: zoneName,
      confidence: +(97 + Math.random() * 2.8).toFixed(1),
      resultStatus,
      gateAction,
      systemNotes: message
    };

    setAlprLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    if (resultStatus === 'GRACE PERIOD INITIATED') {
      addNotification('ALPR Alert: Grace Period Active', message, 'grace_alert', 'security');
    }

    return {
      status: resultStatus,
      action: gateAction,
      message,
      matchedPermit: activePermit || expiredPermit,
      matchedVisitor: visitorPass
    };
  };

  return (
    <ParkingContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        isAuthenticated,
        login,
        registerVisitorAccount,
        registeredVisitors,
        logout,
        updateUserProfile,
        permits,
        applications,
        submitApplication,
        approveApplication,
        rejectApplication,
        renewPermit,
        vehicles,
        registerVehicle,
        zones,
        activeCampus,
        setActiveCampus,
        simulateGateSensor,
        toggleBayStatus,
        updateZoneRules,
        visitors,
        createVisitorReservation,
        cancelVisitorReservation,
        gracePeriods,
        dismissGracePeriod,
        citeGracePeriod,
        violations,
        issueCitation,
        settleFine,
        alprLogs,
        runAlprScan,
        notifications,
        markAllNotificationsRead,
        addNotification,
        activeNavTab,
        setActiveNavTab,
        isKovsieBotOpen,
        setIsKovsieBotOpen,
        isSupportDeskOpen,
        setIsSupportDeskOpen,
        selectedPermitForModal,
        setSelectedPermitForModal,
        selectedVisitorForModal,
        setSelectedVisitorForModal,
        isApplyPermitModalOpen,
        setIsApplyPermitModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        pendingPaymentDetails,
        setPendingPaymentDetails
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

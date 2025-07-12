export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unitNumber: string;
  building: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  vehicleInfo?: {
    licensePlate: string;
    make: string;
    model: string;
    color: string;
  };
  qrCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  photo?: string;
}

export interface AccessLog {
  id: string;
  residentId: string;
  residentName: string;
  unitNumber: string;
  timestamp: Date;
  accessType: 'entry' | 'exit';
  method: 'qr_code' | 'manual' | 'guest';
  location: string;
  securityPersonnel?: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'security' | 'management';
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface QRCodeData {
  residentId: string;
  unitNumber: string;
  timestamp: Date;
  validUntil?: Date;
}

export interface DashboardStats {
  totalResidents: number;
  activeResidents: number;
  todayEntries: number;
  todayExits: number;
  recentActivity: AccessLog[];
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  hostResidentId: string;
  hostName: string;
  expectedArrival: Date;
  actualArrival?: Date;
  departure?: Date;
  qrCode?: string;
  status: 'pending' | 'arrived' | 'departed' | 'expired';
}

export type SortField = 'name' | 'unit' | 'building' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  building?: string;
  isActive?: boolean;
  searchTerm?: string;
}
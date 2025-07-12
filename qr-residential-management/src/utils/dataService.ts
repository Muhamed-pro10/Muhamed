import { Resident, AccessLog, User, DashboardStats, Guest, FilterOptions, SortField, SortDirection } from '../types';
import { generateResidentQRCode } from './qrCode';

// Mock data - In a real app, this would connect to Supabase
const STORAGE_KEYS = {
  RESIDENTS: 'residents',
  ACCESS_LOGS: 'accessLogs',
  USERS: 'users',
  GUESTS: 'guests',
};

// Initialize mock data
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.RESIDENTS)) {
    const mockResidents: Omit<Resident, 'qrCode'>[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        unitNumber: 'A-101',
        building: 'Building A',
        emergencyContact: {
          name: 'Jane Smith',
          phone: '+1-555-0102',
          relationship: 'Spouse',
        },
        vehicleInfo: {
          licensePlate: 'ABC-123',
          make: 'Toyota',
          model: 'Camry',
          color: 'Blue',
        },
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1-555-0201',
        unitNumber: 'B-205',
        building: 'Building B',
        emergencyContact: {
          name: 'Carlos Garcia',
          phone: '+1-555-0202',
          relationship: 'Brother',
        },
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '3',
        firstName: 'David',
        lastName: 'Johnson',
        email: 'david.johnson@email.com',
        phone: '+1-555-0301',
        unitNumber: 'C-312',
        building: 'Building C',
        emergencyContact: {
          name: 'Sarah Johnson',
          phone: '+1-555-0302',
          relationship: 'Wife',
        },
        vehicleInfo: {
          licensePlate: 'XYZ-789',
          make: 'Honda',
          model: 'Accord',
          color: 'Red',
        },
        isActive: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
    ];

    // Generate QR codes for mock residents
    Promise.all(
      mockResidents.map(async (resident) => {
        const qrCode = await generateResidentQRCode(resident as Resident);
        return { ...resident, qrCode };
      })
    ).then((residentsWithQR) => {
      localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residentsWithQR));
    });

    const mockAccessLogs: AccessLog[] = [
      {
        id: '1',
        residentId: '1',
        residentName: 'John Smith',
        unitNumber: 'A-101',
        timestamp: new Date(),
        accessType: 'entry',
        method: 'qr_code',
        location: 'Main Gate',
        securityPersonnel: 'Officer Brown',
      },
      {
        id: '2',
        residentId: '2',
        residentName: 'Maria Garcia',
        unitNumber: 'B-205',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        accessType: 'exit',
        method: 'qr_code',
        location: 'Main Gate',
        securityPersonnel: 'Officer Brown',
      },
    ];

    localStorage.setItem(STORAGE_KEYS.ACCESS_LOGS, JSON.stringify(mockAccessLogs));

    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@compound.com',
        isActive: true,
        lastLogin: new Date(),
      },
      {
        id: '2',
        username: 'security1',
        role: 'security',
        firstName: 'Robert',
        lastName: 'Brown',
        email: 'r.brown@compound.com',
        isActive: true,
        lastLogin: new Date(),
      },
    ];

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
};

// Resident Management
export const getResidents = (filters?: FilterOptions, sortField?: SortField, sortDirection?: SortDirection): Resident[] => {
  const residentsData = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
  let residents: Resident[] = residentsData ? JSON.parse(residentsData) : [];

  // Apply filters
  if (filters) {
    if (filters.building) {
      residents = residents.filter(r => r.building === filters.building);
    }
    if (filters.isActive !== undefined) {
      residents = residents.filter(r => r.isActive === filters.isActive);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      residents = residents.filter(r =>
        r.firstName.toLowerCase().includes(term) ||
        r.lastName.toLowerCase().includes(term) ||
        r.unitNumber.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term)
      );
    }
  }

  // Apply sorting
  if (sortField && sortDirection) {
    residents.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'unit':
          aValue = a.unitNumber;
          bValue = b.unitNumber;
          break;
        case 'building':
          aValue = a.building;
          bValue = b.building;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  return residents;
};

export const getResidentById = (id: string): Resident | null => {
  const residents = getResidents();
  return residents.find(r => r.id === id) || null;
};

export const createResident = async (residentData: Omit<Resident, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>): Promise<Resident> => {
  const residents = getResidents();
  const newResident: Resident = {
    ...residentData,
    id: Date.now().toString(),
    qrCode: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Generate QR code
  newResident.qrCode = await generateResidentQRCode(newResident);

  residents.push(newResident);
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));
  return newResident;
};

export const updateResident = async (id: string, updates: Partial<Resident>): Promise<Resident | null> => {
  const residents = getResidents();
  const index = residents.findIndex(r => r.id === id);

  if (index === -1) return null;

  residents[index] = {
    ...residents[index],
    ...updates,
    updatedAt: new Date(),
  };

  // Regenerate QR code if resident data changed
  if (updates.firstName || updates.lastName || updates.unitNumber) {
    residents[index].qrCode = await generateResidentQRCode(residents[index]);
  }

  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));
  return residents[index];
};

export const deleteResident = (id: string): boolean => {
  const residents = getResidents();
  const filteredResidents = residents.filter(r => r.id !== id);

  if (filteredResidents.length === residents.length) return false;

  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(filteredResidents));
  return true;
};

// Access Log Management
export const getAccessLogs = (limit?: number): AccessLog[] => {
  const logsData = localStorage.getItem(STORAGE_KEYS.ACCESS_LOGS);
  let logs: AccessLog[] = logsData ? JSON.parse(logsData) : [];

  // Convert timestamp strings back to Date objects
  logs = logs.map(log => ({
    ...log,
    timestamp: new Date(log.timestamp),
  }));

  // Sort by timestamp (most recent first)
  logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return limit ? logs.slice(0, limit) : logs;
};

export const createAccessLog = (logData: Omit<AccessLog, 'id'>): AccessLog => {
  const logs = getAccessLogs();
  const newLog: AccessLog = {
    ...logData,
    id: Date.now().toString(),
  };

  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.ACCESS_LOGS, JSON.stringify(logs));
  return newLog;
};

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  const residents = getResidents();
  const logs = getAccessLogs();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  return {
    totalResidents: residents.length,
    activeResidents: residents.filter(r => r.isActive).length,
    todayEntries: todayLogs.filter(log => log.accessType === 'entry').length,
    todayExits: todayLogs.filter(log => log.accessType === 'exit').length,
    recentActivity: logs.slice(0, 10),
  };
};

// User Management
export const getCurrentUser = (): User | null => {
  // In a real app, this would get the authenticated user
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  return users[0] || null;
};

// Initialize mock data when the module loads
initializeMockData();
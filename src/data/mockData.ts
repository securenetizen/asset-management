import { User, Requisition, Notification } from '../types';
import { generateId } from '../lib/utils';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    department: 'Marketing'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'manager@example.com',
    role: 'manager',
    department: 'Operations'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    department: 'Administration'
  }
];

// Mock Requisitions
export const mockRequisitions: Requisition[] = [
  {
    id: generateId(),
    title: 'New Laptop for Design Team',
    description: 'Need a high-performance laptop for the new design team member',
    items: [
      {
        id: generateId(),
        name: 'MacBook Pro 16"',
        description: 'Apple M2 Pro, 32GB RAM, 1TB SSD',
        quantity: 1,
        estimatedCost: 2899,
        justification: 'Required for graphic design and video editing work'
      },
      {
        id: generateId(),
        name: 'Monitor',
        description: '27" 4K Monitor',
        quantity: 1,
        estimatedCost: 699,
        justification: 'Required for extended workspace'
      }
    ],
    totalCost: 3598,
    status: 'pending',
    createdBy: '1',
    createdAt: new Date(2025, 0, 15).toISOString(),
    updatedAt: new Date(2025, 0, 15).toISOString()
  },
  {
    id: generateId(),
    title: 'Office Furniture',
    description: 'New furniture for the meeting room',
    items: [
      {
        id: generateId(),
        name: 'Conference Table',
        description: 'Large oval conference table',
        quantity: 1,
        estimatedCost: 1200,
        justification: 'Current table is damaged and too small'
      },
      {
        id: generateId(),
        name: 'Office Chairs',
        description: 'Ergonomic office chairs',
        quantity: 8,
        estimatedCost: 350,
        justification: 'Current chairs are uncomfortable for long meetings'
      }
    ],
    totalCost: 4000,
    status: 'approved',
    createdBy: '1',
    createdAt: new Date(2025, 0, 10).toISOString(),
    updatedAt: new Date(2025, 0, 12).toISOString(),
    approvedBy: '2',
    approvedAt: new Date(2025, 0, 12).toISOString()
  },
  {
    id: generateId(),
    title: 'Software Licenses',
    description: 'Adobe Creative Cloud licenses for the marketing team',
    items: [
      {
        id: generateId(),
        name: 'Adobe Creative Cloud',
        description: 'Annual subscription',
        quantity: 3,
        estimatedCost: 599.88,
        justification: 'Required for creating marketing materials'
      }
    ],
    totalCost: 1799.64,
    status: 'completed',
    createdBy: '1',
    createdAt: new Date(2024, 11, 5).toISOString(),
    updatedAt: new Date(2024, 11, 15).toISOString(),
    approvedBy: '2',
    approvedAt: new Date(2024, 11, 7).toISOString()
  },
  {
    id: generateId(),
    title: 'Office Supplies',
    description: 'General office supplies for Q2',
    items: [
      {
        id: generateId(),
        name: 'Printer Paper',
        description: 'Letter size, 10 reams',
        quantity: 10,
        estimatedCost: 6.99,
        justification: 'Regular office use'
      },
      {
        id: generateId(),
        name: 'Ink Cartridges',
        description: 'HP LaserJet Black',
        quantity: 5,
        estimatedCost: 79.99,
        justification: 'For office printers'
      },
      {
        id: generateId(),
        name: 'Sticky Notes',
        description: 'Assorted colors, 12 packs',
        quantity: 12,
        estimatedCost: 3.49,
        justification: 'General office use'
      }
    ],
    totalCost: 534.73,
    status: 'rejected',
    createdBy: '1',
    createdAt: new Date(2025, 0, 3).toISOString(),
    updatedAt: new Date(2025, 0, 5).toISOString(),
    rejectedBy: '2',
    rejectedAt: new Date(2025, 0, 5).toISOString(),
    rejectionReason: 'Please consolidate with other departments to make a larger order'
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: generateId(),
    title: 'Requisition Approved',
    message: 'Your requisition for "Office Furniture" has been approved',
    read: false,
    createdAt: new Date(2025, 0, 12).toISOString()
  },
  {
    id: generateId(),
    title: 'New Requisition',
    message: 'A new requisition "New Laptop for Design Team" requires your approval',
    read: true,
    createdAt: new Date(2025, 0, 15).toISOString()
  },
  {
    id: generateId(),
    title: 'Requisition Rejected',
    message: 'Your requisition for "Office Supplies" has been rejected',
    read: false,
    createdAt: new Date(2025, 0, 5).toISOString()
  }
];
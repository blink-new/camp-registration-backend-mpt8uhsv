export interface Registration {
  id: string
  userId: string
  name: string
  description?: string
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  registrationDeadline: string
  campFee: number
  status: 'draft' | 'open' | 'closed' | 'cancelled'
  location?: string
  ageMin?: number
  ageMax?: number
  requiredForms: string[] // Array of form types required for this registration
  createdAt: string
  updatedAt: string
}

export interface Participant {
  id: string
  userId: string
  registrationId?: string // Make optional for backward compatibility
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  medicalConditions?: string
  dietaryRestrictions?: string
  registrationDate: string
  status: 'Complete' | 'Pending' | 'Cancelled'
  createdAt: string
  updatedAt: string
}

export interface Form {
  id: string
  userId: string
  registrationId: string // Forms are now linked to registrations
  participantId: string // Still track which participant completed it
  formType: 'registration' | 'medical' | 'emergency' | 'waiver' | 'photo_consent' | 'transportation' | 'activity_consent' | 'custom'
  title?: string
  status: 'incomplete' | 'complete' | 'pending_review'
  formData?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  userId: string
  registrationId: string
  participantId: string
  amount: number
  paymentMethod?: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  paymentDate?: string
  dueDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Cabin {
  id: string
  userId: string
  name: string
  capacity: number
  currentOccupancy: number
  cabinType: 'standard' | 'premium' | 'accessible'
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Transportation {
  id: string
  userId: string
  vehicleType: 'bus' | 'van' | 'car'
  vehicleName: string
  capacity: number
  currentOccupancy: number
  departureLocation?: string
  departureTime?: string
  arrivalTime?: string
  driverName?: string
  driverPhone?: string
  createdAt: string
  updatedAt: string
}

export interface CabinAssignment {
  id: string
  userId: string
  participantId: string
  cabinId: string
  assignedDate: string
  checkInDate?: string
  checkOutDate?: string
  bedNumber?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TransportationAssignment {
  id: string
  userId: string
  participantId: string
  transportationId: string
  assignedDate: string
  pickupLocation?: string
  pickupTime?: string
  seatNumber?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalParticipants: number
  pendingRegistrations: number
  completedPayments: number
  pendingPayments: number
  completedForms: number
  pendingForms: number
  cabinOccupancy: number
  transportationOccupancy: number
}
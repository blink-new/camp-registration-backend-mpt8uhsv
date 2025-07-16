import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Mail, 
  Phone,
  Calendar,
  AlertTriangle,
  Users,
  UserCheck,
  Clock,
  XCircle,
  Download,
  MoreHorizontal,
  ArrowLeft,
  Upload
} from 'lucide-react'
import { Participant } from '@/types'
import { ParticipantModal } from './ParticipantModal'
import { ImportModal } from './ImportModal'
import { blink } from '@/blink/client'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRegistration } from '@/contexts/RegistrationContext'

// Mock data - in a real app, this would come from the database filtered by registrationId
const mockParticipants: Participant[] = [
  {
    id: '1',
    userId: 'user1',
    registrationId: '1', // Summer Adventure Camp
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '2010-05-15',
    emergencyContactName: 'Mary Johnson',
    emergencyContactPhone: '+1 (555) 987-6543',
    medicalConditions: 'Asthma - requires inhaler during physical activities',
    dietaryRestrictions: 'Vegetarian, no nuts',
    registrationDate: '2024-01-15T10:30:00Z',
    status: 'Complete',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    registrationId: '1', // Summer Adventure Camp
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '2011-08-22',
    emergencyContactName: 'Lisa Chen',
    emergencyContactPhone: '+1 (555) 876-5432',
    medicalConditions: '',
    dietaryRestrictions: 'Gluten-free',
    registrationDate: '2024-01-16T14:20:00Z',
    status: 'Pending',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    registrationId: '1', // Summer Adventure Camp
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '2009-12-03',
    emergencyContactName: 'Robert Davis',
    emergencyContactPhone: '+1 (555) 765-4321',
    medicalConditions: 'Severe peanut allergy - EpiPen required',
    dietaryRestrictions: 'No nuts, no shellfish',
    registrationDate: '2024-01-17T09:15:00Z',
    status: 'Complete',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    userId: 'user4',
    registrationId: '2', // Winter Sports Camp
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '2012-03-10',
    emergencyContactName: 'Jennifer Wilson',
    emergencyContactPhone: '+1 (555) 654-3210',
    medicalConditions: 'ADHD - takes medication daily',
    dietaryRestrictions: '',
    registrationDate: '2024-01-18T16:45:00Z',
    status: 'Cancelled',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    userId: 'user5',
    registrationId: '2', // Winter Sports Camp
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@email.com',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '2010-11-28',
    emergencyContactName: 'Carlos Martinez',
    emergencyContactPhone: '+1 (555) 543-2109',
    medicalConditions: '',
    dietaryRestrictions: 'Lactose intolerant',
    registrationDate: '2024-01-19T11:30:00Z',
    status: 'Cancelled',
    createdAt: '2024-01-19T11:30:00Z',
    updatedAt: '2024-01-19T11:30:00Z'
  }
]

export function Participants() {
  const { selectedRegistration, registrations } = useRegistration()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadParticipants()
  }, [selectedRegistration])

  const loadParticipants = async () => {
    if (!selectedRegistration) {
      setParticipants([])
      return
    }

    try {
      setIsLoading(true)
      // In a real app: const data = await blink.db.participants.list({ where: { registrationId: selectedRegistration.id } })
      const filteredParticipants = mockParticipants.filter(p => p.registrationId === selectedRegistration.id)
      setParticipants(filteredParticipants)
    } catch (error) {
      console.error('Error loading participants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Participant['status']) => {
    const configs = {
      Pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-700 bg-yellow-100' },
      Complete: { variant: 'default' as const, icon: UserCheck, color: 'text-green-700 bg-green-100' },
      Cancelled: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-700 bg-gray-100' }
    }

    const config = configs[status] || configs.Pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </div>
    )
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleViewParticipant = (participant: Participant) => {
    setSelectedParticipant(participant)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleEditParticipant = (participant: Participant) => {
    setSelectedParticipant(participant)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreateParticipant = () => {
    setSelectedParticipant(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleSaveParticipant = async (participantData: Participant) => {
    setIsLoading(true)
    try {
      if (modalMode === 'create') {
        // Add registrationId to new participant
        const newParticipant = {
          ...participantData,
          registrationId: selectedRegistration?.id || ''
        }
        // In a real app: await blink.db.participants.create(newParticipant)
        setParticipants(prev => [...prev, newParticipant])
      } else {
        // In a real app: await blink.db.participants.update(participantData.id, participantData)
        setParticipants(prev => 
          prev.map(p => p.id === participantData.id ? participantData : p)
        )
      }
      setIsModalOpen(false)
      setSelectedParticipant(null)
    } catch (error) {
      console.error('Error saving participant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedParticipant(null)
  }

  const handleImportParticipants = async (importedParticipants: Participant[]) => {
    try {
      // In a real app: await blink.db.participants.createMany(importedParticipants)
      setParticipants(prev => [...prev, ...importedParticipants])
      setIsImportModalOpen(false)
    } catch (error) {
      console.error('Error importing participants:', error)
      throw error // Re-throw to let ImportModal handle the error
    }
  }

  const getStats = () => {
    return {
      total: participants.length,
      pending: participants.filter(p => p.status === 'Pending').length,
      complete: participants.filter(p => p.status === 'Complete').length,
      cancelled: participants.filter(p => p.status === 'Cancelled').length,
      withMedical: participants.filter(p => p.medicalConditions && p.medicalConditions.trim()).length
    }
  }

  const stats = getStats()

  // Show message if no registration is selected
  if (!selectedRegistration) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Registration Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select a camp registration from the Registrations page to view and manage participants.
          </p>
          <Button 
            onClick={() => window.location.hash = '#registrations'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Registrations
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Registration Context */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Participants</h1>
          <p className="text-gray-600 mt-2">
            Manage participants for the selected camp registration
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Managing participants for:</p>
                <p className="text-blue-800 font-semibold">{selectedRegistration.name}</p>
                <p className="text-sm text-blue-700">
                  {new Date(selectedRegistration.startDate).toLocaleDateString()} - {new Date(selectedRegistration.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">{participants.length}</p>
                <p className="text-sm text-blue-700">of {selectedRegistration.maxParticipants}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            onClick={handleCreateParticipant}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            disabled={participants.length >= selectedRegistration.maxParticipants}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-sm text-blue-700">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                <p className="text-sm text-yellow-700">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg mr-3">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.complete}</p>
                <p className="text-sm text-green-700">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 rounded-lg mr-3">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
                <p className="text-sm text-red-700">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-500 rounded-lg mr-3">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{stats.withMedical}</p>
                <p className="text-sm text-orange-700">Medical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search participants by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto border-gray-300 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table - Desktop */}
      <Card className="hidden md:block shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            All Participants ({filteredParticipants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">Participant</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Age</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Registration</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {participant.firstName.charAt(0)}{participant.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {participant.firstName} {participant.lastName}
                          </div>
                          {participant.medicalConditions && (
                            <div className="flex items-center text-xs text-orange-600 mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Medical conditions
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-gray-400" />
                          <span className="truncate max-w-[200px]">{participant.email}</span>
                        </div>
                        {participant.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2 text-gray-400" />
                            {participant.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {participant.dateOfBirth ? calculateAge(participant.dateOfBirth) : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(participant.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                        {new Date(participant.registrationDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewParticipant(participant)}
                          className="hover:bg-blue-50 hover:border-blue-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditParticipant(participant)}
                          className="hover:bg-green-50 hover:border-green-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="hover:bg-gray-50">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewParticipant(participant)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Participant
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Participants Cards - Mobile */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            All Participants ({filteredParticipants.length})
          </h2>
        </div>
        {filteredParticipants.map((participant) => (
          <Card key={participant.id} className="shadow-lg border-0 bg-white">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {participant.firstName.charAt(0)}{participant.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span>Age: {participant.dateOfBirth ? calculateAge(participant.dateOfBirth) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(participant.status)}
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="break-all">{participant.email}</span>
                  </div>
                  {participant.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                      {participant.phone}
                    </div>
                  )}
                </div>

                {/* Medical Alert */}
                {participant.medicalConditions && (
                  <div className="flex items-center text-xs text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    Medical conditions noted - view details for more information
                  </div>
                )}

                {/* Registration Date */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                  Registered: {new Date(participant.registrationDate).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => handleViewParticipant(participant)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 hover:bg-green-50 hover:border-green-200"
                    onClick={() => handleEditParticipant(participant)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Participant Modal */}
      <ParticipantModal
        participant={selectedParticipant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveParticipant}
        mode={modalMode}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportParticipants}
        registrationId={selectedRegistration?.id || ''}
      />
    </div>
  )
}
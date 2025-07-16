import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Settings,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react'
import { Registration } from '@/types'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRegistration } from '@/contexts/RegistrationContext'
import { blink } from '@/blink/client'

interface RegistrationModalProps {
  registration: Registration | null
  isOpen: boolean
  onClose: () => void
  onSave: (registration: Registration) => void
  mode: 'view' | 'edit' | 'create'
}

function RegistrationModal({ registration, isOpen, onClose, onSave, mode }: RegistrationModalProps) {
  const [formData, setFormData] = useState<Partial<Registration>>({})

  useEffect(() => {
    if (registration) {
      setFormData(registration)
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        maxParticipants: 50,
        currentParticipants: 0,
        registrationDeadline: '',
        campFee: 0,
        status: 'draft',
        location: '',
        ageMin: 6,
        ageMax: 18
      })
    }
  }, [registration, mode])

  const handleSave = async () => {
    if (formData.name && formData.startDate && formData.endDate) {
      const registrationData: Registration = {
        id: registration?.id || `reg_${Date.now()}`,
        userId: 'current_user',
        name: formData.name!,
        description: formData.description,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        maxParticipants: formData.maxParticipants || 50,
        currentParticipants: formData.currentParticipants || 0,
        registrationDeadline: formData.registrationDeadline!,
        campFee: formData.campFee || 0,
        status: formData.status || 'draft',
        location: formData.location,
        ageMin: formData.ageMin,
        ageMax: formData.ageMax,
        requiredForms: formData.requiredForms || [],
        createdAt: registration?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      onSave(registrationData)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Registration' : 
             mode === 'edit' ? 'Edit Registration' : 'Registration Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Camp Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter camp name"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter camp location"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="campFee">Camp Fee ($)</Label>
                <Input
                  id="campFee"
                  type="number"
                  step="0.01"
                  value={formData.campFee || ''}
                  onChange={(e) => setFormData({ ...formData, campFee: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants || ''}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline || ''}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageMin">Min Age</Label>
                  <Input
                    id="ageMin"
                    type="number"
                    value={formData.ageMin || ''}
                    onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) || 0 })}
                    placeholder="6"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <Label htmlFor="ageMax">Max Age</Label>
                  <Input
                    id="ageMax"
                    type="number"
                    value={formData.ageMax || ''}
                    onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) || 0 })}
                    placeholder="18"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter camp description"
              rows={4}
              disabled={isReadOnly}
            />
          </div>

          {/* Required Forms Section */}
          <div>
            <Label>Required Forms for This Registration</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {[
                { id: 'registration', label: 'Registration Form' },
                { id: 'medical', label: 'Medical Information' },
                { id: 'emergency', label: 'Emergency Contact' },
                { id: 'waiver', label: 'Liability Waiver' },
                { id: 'photo_consent', label: 'Photo Consent' },
                { id: 'transportation', label: 'Transportation' },
                { id: 'activity_consent', label: 'Activity Consent' }
              ].map((form) => (
                <div key={form.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`form-${form.id}`}
                    checked={(formData.requiredForms || []).includes(form.id)}
                    onChange={(e) => {
                      const currentForms = formData.requiredForms || []
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          requiredForms: [...currentForms, form.id] 
                        })
                      } else {
                        setFormData({ 
                          ...formData, 
                          requiredForms: currentForms.filter(f => f !== form.id) 
                        })
                      }
                    }}
                    disabled={isReadOnly}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label 
                    htmlFor={`form-${form.id}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {form.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select which forms participants must complete for this registration
            </p>
          </div>

          {!isReadOnly && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'draft'} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Registration['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {!isReadOnly && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {mode === 'create' ? 'Create Registration' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function Registrations() {
  const { registrations, setRegistrations, selectedRegistration, setSelectedRegistration } = useRegistration()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalRegistration, setModalRegistration] = useState<Registration | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      // For now, use mock data. In a real app, this would be:
      // const data = await blink.db.registrations.list()
      const mockRegistrations: Registration[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Summer Adventure Camp 2024',
          description: 'A week-long outdoor adventure camp for kids aged 8-14',
          startDate: '2024-07-15',
          endDate: '2024-07-22',
          maxParticipants: 50,
          currentParticipants: 32,
          registrationDeadline: '2024-06-15',
          campFee: 450.00,
          status: 'open',
          location: 'Pine Lake Camp Grounds',
          ageMin: 8,
          ageMax: 14,
          requiredForms: ['registration', 'medical', 'emergency', 'waiver'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user1',
          name: 'Winter Sports Camp 2024',
          description: 'Skiing and snowboarding camp for teenagers',
          startDate: '2024-12-20',
          endDate: '2024-12-27',
          maxParticipants: 30,
          currentParticipants: 8,
          registrationDeadline: '2024-11-20',
          campFee: 650.00,
          status: 'draft',
          location: 'Mountain View Resort',
          ageMin: 12,
          ageMax: 18,
          requiredForms: ['registration', 'medical', 'emergency', 'waiver', 'activity_consent'],
          createdAt: '2024-01-20T14:20:00Z',
          updatedAt: '2024-01-20T14:20:00Z'
        },
        {
          id: '3',
          userId: 'user1',
          name: 'Spring Nature Camp 2024',
          description: 'Educational nature camp focusing on wildlife and conservation',
          startDate: '2024-04-10',
          endDate: '2024-04-15',
          maxParticipants: 25,
          currentParticipants: 25,
          registrationDeadline: '2024-03-10',
          campFee: 350.00,
          status: 'closed',
          location: 'Forest Education Center',
          ageMin: 6,
          ageMax: 12,
          requiredForms: ['registration', 'medical', 'emergency', 'photo_consent'],
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-03-15T16:45:00Z'
        }
      ]
      setRegistrations(mockRegistrations)
      
      // Auto-select the first open registration if none selected
      if (!selectedRegistration && mockRegistrations.length > 0) {
        const openRegistration = mockRegistrations.find(r => r.status === 'open') || mockRegistrations[0]
        setSelectedRegistration(openRegistration)
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Registration['status']) => {
    const configs = {
      draft: { variant: 'secondary' as const, icon: Clock, color: 'text-gray-700 bg-gray-100' },
      open: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-700 bg-green-100' },
      closed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-700 bg-red-100' },
      cancelled: { variant: 'outline' as const, icon: AlertCircle, color: 'text-orange-700 bg-orange-100' }
    }

    const config = configs[status]
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    )
  }

  const handleViewRegistration = (registration: Registration) => {
    setModalRegistration(registration)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleEditRegistration = (registration: Registration) => {
    setModalRegistration(registration)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreateRegistration = () => {
    setModalRegistration(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleSaveRegistration = async (registrationData: Registration) => {
    try {
      if (modalMode === 'create') {
        // In a real app: await blink.db.registrations.create(registrationData)
        setRegistrations(prev => [...prev, registrationData])
        setSelectedRegistration(registrationData)
      } else {
        // In a real app: await blink.db.registrations.update(registrationData.id, registrationData)
        setRegistrations(prev => 
          prev.map(r => r.id === registrationData.id ? registrationData : r)
        )
        if (selectedRegistration?.id === registrationData.id) {
          setSelectedRegistration(registrationData)
        }
      }
      setIsModalOpen(false)
      setModalRegistration(null)
    } catch (error) {
      console.error('Error saving registration:', error)
    }
  }

  const handleSelectRegistration = (registration: Registration) => {
    setSelectedRegistration(registration)
  }

  const getStats = () => {
    return {
      total: registrations.length,
      draft: registrations.filter(r => r.status === 'draft').length,
      open: registrations.filter(r => r.status === 'open').length,
      closed: registrations.filter(r => r.status === 'closed').length,
      totalParticipants: registrations.reduce((sum, r) => sum + r.currentParticipants, 0)
    }
  }

  const stats = getStats()

  if (loading) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Camp Registrations</h1>
          <p className="text-gray-600 mt-2">
            Manage multiple camp registrations and their participants
          </p>
          {selectedRegistration && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Currently Managing:</p>
                  <p className="text-blue-800">{selectedRegistration.name}</p>
                </div>
                {getStatusBadge(selectedRegistration.status)}
              </div>
            </div>
          )}
        </div>
        <Button 
          onClick={handleCreateRegistration}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Registration
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-sm text-blue-700">Total Camps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-500 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                <p className="text-sm text-gray-700">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.open}</p>
                <p className="text-sm text-green-700">Open</p>
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
                <p className="text-2xl font-bold text-red-900">{stats.closed}</p>
                <p className="text-sm text-red-700">Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500 rounded-lg mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{stats.totalParticipants}</p>
                <p className="text-sm text-purple-700">Participants</p>
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
                placeholder="Search registrations by name, location, or description..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table - Desktop */}
      <Card className="hidden md:block shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            All Registrations ({filteredRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">Camp Name</TableHead>
                  <TableHead className="font-semibold">Dates</TableHead>
                  <TableHead className="font-semibold">Participants</TableHead>
                  <TableHead className="font-semibold">Fee</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow 
                    key={registration.id} 
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      selectedRegistration?.id === registration.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleSelectRegistration(registration)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{registration.name}</div>
                        {registration.location && (
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {registration.location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {new Date(registration.startDate).toLocaleDateString()} - {new Date(registration.endDate).toLocaleDateString()}
                        </div>
                        {registration.registrationDeadline && (
                          <div className="text-gray-600 mt-1">
                            Deadline: {new Date(registration.registrationDeadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{registration.currentParticipants}</span>
                        <span className="text-gray-600">/{registration.maxParticipants}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {registration.campFee.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(registration.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewRegistration(registration)}
                          className="hover:bg-blue-50 hover:border-blue-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRegistration(registration)}
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
                            <DropdownMenuItem onClick={() => handleSelectRegistration(registration)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Select for Management
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewRegistration(registration)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditRegistration(registration)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Registration
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
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

      {/* Registrations Cards - Mobile */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            All Registrations ({filteredRegistrations.length})
          </h2>
        </div>
        {filteredRegistrations.map((registration) => (
          <Card 
            key={registration.id} 
            className={`shadow-lg border-0 bg-white cursor-pointer ${
              selectedRegistration?.id === registration.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleSelectRegistration(registration)}
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{registration.name}</h3>
                    {registration.location && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {registration.location}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(registration.status)}
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                    {new Date(registration.startDate).toLocaleDateString()} - {new Date(registration.endDate).toLocaleDateString()}
                  </div>
                  {registration.registrationDeadline && (
                    <div className="text-sm text-gray-600">
                      Registration Deadline: {new Date(registration.registrationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      <span className="font-medium">{registration.currentParticipants}</span>
                      <span className="text-gray-600">/{registration.maxParticipants}</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm font-medium">${registration.campFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Description */}
                {registration.description && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {registration.description}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => handleViewRegistration(registration)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 hover:bg-green-50 hover:border-green-200"
                    onClick={() => handleEditRegistration(registration)}
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

      {/* Registration Modal */}
      <RegistrationModal
        registration={modalRegistration}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRegistration}
        mode={modalMode}
      />
    </div>
  )
}
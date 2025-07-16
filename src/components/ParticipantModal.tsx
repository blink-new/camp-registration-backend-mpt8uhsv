import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  AlertTriangle, 
  Heart,
  Shield,
  MapPin,
  Clock,
  Edit3,
  Save,
  X,
  UserCheck,
  Home,
  Bus,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  DollarSign,
  CreditCard,
  Plus,
  Receipt,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Participant, Form, Payment } from '@/types'
import { useRegistration } from '@/contexts/RegistrationContext'
import { PaymentModal } from './PaymentModal'

interface ParticipantModalProps {
  participant: Participant | null
  isOpen: boolean
  onClose: () => void
  onSave: (participant: Participant) => void
  mode: 'view' | 'edit' | 'create'
}

export function ParticipantModal({ participant, isOpen, onClose, onSave, mode }: ParticipantModalProps) {
  const { selectedRegistration } = useRegistration()
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
  const [formData, setFormData] = useState<Partial<Participant>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [participantForms, setParticipantForms] = useState<Form[]>([])
  const [participantPayments, setParticipantPayments] = useState<Payment[]>([])
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [paymentModalMode, setPaymentModalMode] = useState<'view' | 'edit' | 'create'>('view')

  const loadParticipantPayments = (participantId: string) => {
    // Mock payment data - in real app this would come from database
    const mockPayments: Payment[] = [
      {
        id: 'payment_1',
        userId: 'user1',
        registrationId: selectedRegistration?.id || '1',
        participantId: participantId,
        amount: 250.00,
        paymentMethod: 'Credit Card',
        paymentStatus: 'completed',
        transactionId: 'txn_abc123',
        paymentDate: '2024-01-15T10:30:00Z',
        dueDate: '2024-01-10T00:00:00Z',
        notes: 'Registration fee payment',
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'payment_2',
        userId: 'user1',
        registrationId: selectedRegistration?.id || '1',
        participantId: participantId,
        amount: 100.00,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'pending',
        transactionId: '',
        paymentDate: '',
        dueDate: '2024-02-01T00:00:00Z',
        notes: 'Activity fee payment',
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-01-20T14:00:00Z'
      }
    ]
    
    // Filter payments for this participant
    const filteredPayments = mockPayments.filter(p => p.participantId === participantId)
    setParticipantPayments(filteredPayments)
  }

  const calculateBalance = () => {
    const totalPaid = participantPayments
      .filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const totalDue = participantPayments.reduce((sum, p) => sum + p.amount, 0)
    const balance = totalDue - totalPaid
    
    return { totalPaid, totalDue, balance }
  }

  const handleAddPayment = () => {
    setSelectedPayment(null)
    setPaymentModalMode('create')
    setIsPaymentModalOpen(true)
  }

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setPaymentModalMode('view')
    setIsPaymentModalOpen(true)
  }

  const handleSavePayment = (payment: Payment) => {
    if (paymentModalMode === 'create') {
      setParticipantPayments(prev => [...prev, payment])
    } else {
      setParticipantPayments(prev => prev.map(p => p.id === payment.id ? payment : p))
    }
    setIsPaymentModalOpen(false)
  }

  useEffect(() => {
    if (participant) {
      setFormData(participant)
      // Generate forms based on the selected registration's required forms
      generateFormsForParticipant(participant.id)
      // Load payments for this participant
      loadParticipantPayments(participant.id)
    } else if (mode === 'create') {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        medicalConditions: '',
        dietaryRestrictions: '',
        status: 'pending'
      })
      setParticipantForms([])
      setParticipantPayments([])
    }
    setIsEditing(mode === 'edit' || mode === 'create')
  }, [participant, mode, selectedRegistration])

  const generateFormsForParticipant = (participantId: string) => {
    if (!selectedRegistration || !selectedRegistration.requiredForms) {
      setParticipantForms([])
      return
    }

    // Generate forms based on registration's required forms
    const generatedForms: Form[] = selectedRegistration.requiredForms.map((formType) => {
      // Check if we have existing form data for this participant and form type
      const existingForm = mockFormsData.find(f => 
        f.participantId === participantId && 
        f.formType === formType as Form['formType']
      )

      if (existingForm) {
        return existingForm
      }

      // Create new form entry with default incomplete status
      return {
        id: `form_${participantId}_${formType}_${Date.now()}`,
        userId: 'current_user',
        registrationId: selectedRegistration.id,
        participantId: participantId,
        formType: formType as Form['formType'],
        status: 'incomplete' as Form['status'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })

    setParticipantForms(generatedForms)
  }

  // Mock forms data for demonstration - in a real app this would come from the database
  const mockFormsData: Form[] = [
    {
      id: 'form_1_registration',
      userId: 'user1',
      registrationId: '1',
      participantId: '1',
      formType: 'registration',
      status: 'complete',
      formData: JSON.stringify({ completed: true, submittedAt: '2024-01-15T10:30:00Z' }),
      completedAt: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'form_1_medical',
      userId: 'user1',
      registrationId: '1',
      participantId: '1',
      formType: 'medical',
      status: 'complete',
      formData: JSON.stringify({ allergies: 'Peanuts', medications: 'Inhaler' }),
      completedAt: '2024-01-15T11:00:00Z',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 'form_1_waiver',
      userId: 'user1',
      registrationId: '1',
      participantId: '1',
      formType: 'waiver',
      status: 'pending_review',
      formData: JSON.stringify({ signed: true, parentSignature: true }),
      createdAt: '2024-01-15T11:30:00Z',
      updatedAt: '2024-01-15T11:30:00Z'
    }
  ]

  const handleSave = async () => {
    if (formData.firstName && formData.lastName && formData.email) {
      setIsSaving(true)
      try {
        const participantData: Participant = {
          id: participant?.id || `participant_${Date.now()}`,
          userId: 'current_user',
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          email: formData.email!,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          medicalConditions: formData.medicalConditions,
          dietaryRestrictions: formData.dietaryRestrictions,
          registrationDate: participant?.registrationDate || new Date().toISOString(),
          status: formData.status || 'pending',
          createdAt: participant?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        onSave(participantData)
        setIsEditing(false)
      } catch (error) {
        console.error('Error saving participant:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getStatusConfig = (status: Participant['status']) => {
    const configs = {
      complete: { variant: 'default' as const, icon: CheckCircle },
      pending: { variant: 'secondary' as const, icon: Clock },
      cancelled: { variant: 'outline' as const, icon: X },
      approved: { variant: 'default' as const, icon: UserCheck },
      rejected: { variant: 'destructive' as const, icon: XCircle }
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  const getStatusBadge = (status: Participant['status']) => {
    const config = getStatusConfig(status)
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getCompletionProgress = () => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.dateOfBirth,
      formData.emergencyContactName,
      formData.emergencyContactPhone
    ]
    const completed = fields.filter(field => field && field.trim()).length
    return Math.round((completed / fields.length) * 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {mode === 'create' ? 'Add New Participant' : 
                   isEditing ? 'Edit Participant' : `${participant?.firstName} ${participant?.lastName}`}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-0.5">
                  {mode === 'create' ? 'Create new participant registration' : 
                   isEditing ? 'Update participant information' : 
                   participant?.email ? `${participant.email} • Registered ${participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : 'N/A'}` : 'Participant profile'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {mode !== 'create' && !isEditing && participant?.status && (
                <div className="mr-2">
                  {getStatusBadge(participant.status)}
                </div>
              )}
              {mode !== 'create' && !isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-sm"
                >
                  <Edit3 className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isEditing ? (
            <div className="space-y-6 p-2">
              {/* Progress */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">Profile Completion</span>
                    <span className="text-sm font-bold text-blue-700">{getCompletionProgress()}%</span>
                  </div>
                  <Progress value={getCompletionProgress()} className="h-2" />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <User className="h-4 w-4 text-blue-600 mr-2" />
                      <h3 className="text-sm font-semibold">Personal Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">First Name *</Label>
                          <Input
                            value={formData.firstName || ''}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Last Name *</Label>
                          <Input
                            value={formData.lastName || ''}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Email *</Label>
                        <Input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Phone</Label>
                        <Input
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Date of Birth</Label>
                        <Input
                          type="date"
                          value={formData.dateOfBirth || ''}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Status</Label>
                        <Select 
                          value={formData.status || 'pending'} 
                          onValueChange={(value) => setFormData({ ...formData, status: value as Participant['status'] })}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency & Medical */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <Shield className="h-4 w-4 text-red-600 mr-2" />
                        <h3 className="text-sm font-semibold">Emergency Contact</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-600">Contact Name</Label>
                          <Input
                            value={formData.emergencyContactName || ''}
                            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Contact Phone</Label>
                          <Input
                            value={formData.emergencyContactPhone || ''}
                            onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <Heart className="h-4 w-4 text-pink-600 mr-2" />
                        <h3 className="text-sm font-semibold">Medical & Dietary</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-600">Medical Conditions</Label>
                          <Textarea
                            value={formData.medicalConditions || ''}
                            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                            rows={2}
                            className="text-sm resize-none"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Dietary Restrictions</Label>
                          <Textarea
                            value={formData.dietaryRestrictions || ''}
                            onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                            rows={2}
                            className="text-sm resize-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (mode === 'create') {
                      onClose()
                    } else {
                      setIsEditing(false)
                      setFormData(participant || {})
                    }
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !formData.firstName || !formData.lastName || !formData.email}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 mr-1" />
                      {mode === 'create' ? 'Create' : 'Save'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-1">
              {/* Header */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarFallback className="bg-blue-500 text-white text-sm font-semibold">
                        {getInitials(participant?.firstName, participant?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            {participant?.firstName} {participant?.lastName}
                          </h2>
                          <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Age: {participant?.dateOfBirth ? calculateAge(participant.dateOfBirth) : 'N/A'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Registered: {participant?.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        {participant?.status && getStatusBadge(participant.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-8">
                  <TabsTrigger value="overview" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="forms" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Forms
                  </TabsTrigger>
                  <TabsTrigger value="emergency" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Emergency
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Assignments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-3">
                  {/* Registration Status Overview */}
                  <Card className="bg-gradient-to-r from-slate-50 to-gray-100 border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Registration Status</h3>
                        <div className="flex items-center space-x-2">
                          {participant?.status && getStatusBadge(participant.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Personal Info Completion */}
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium">Personal Info</span>
                            </div>
                            <span className="text-xs text-blue-700">{getCompletionProgress()}%</span>
                          </div>
                          <Progress value={getCompletionProgress()} className="h-2" />
                        </div>

                        {/* Forms Completion */}
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="text-sm font-medium">Forms</span>
                            </div>
                            <span className="text-xs text-purple-700">
                              {participantForms.length > 0 
                                ? `${participantForms.filter(f => f.status === 'complete').length}/${participantForms.length}`
                                : '0/0'
                              }
                            </span>
                          </div>
                          <Progress 
                            value={participantForms.length > 0 
                              ? (participantForms.filter(f => f.status === 'complete').length / participantForms.length) * 100 
                              : 0
                            } 
                            className="h-2" 
                          />
                        </div>

                        {/* Payment Status */}
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium">Payments</span>
                            </div>
                            <span className="text-xs text-green-700">
                              ${calculateBalance().totalPaid.toFixed(0)}/${calculateBalance().totalDue.toFixed(0)}
                            </span>
                          </div>
                          <Progress 
                            value={calculateBalance().totalDue > 0 
                              ? (calculateBalance().totalPaid / calculateBalance().totalDue) * 100 
                              : 0
                            } 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Personal Information Summary */}
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3 flex items-center">
                          <User className="h-4 w-4 text-blue-600 mr-2" />
                          Personal Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Full Name</span>
                            <span className="text-sm font-medium">{participant?.firstName} {participant?.lastName}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Age</span>
                            <span className="text-sm font-medium">
                              {participant?.dateOfBirth ? calculateAge(participant.dateOfBirth) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Email</span>
                            <span className="text-sm font-medium truncate max-w-[150px]">{participant?.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Phone</span>
                            <span className="text-sm font-medium">{participant?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Registration Date</span>
                            <span className="text-sm font-medium">
                              {participant?.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                            Payment Summary
                          </h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleAddPayment}
                            className="text-xs h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Due</span>
                            <span className="text-sm font-bold text-blue-900">
                              ${calculateBalance().totalDue.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Paid</span>
                            <span className="text-sm font-bold text-green-600">
                              ${calculateBalance().totalPaid.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Outstanding</span>
                            <span className={`text-sm font-bold ${calculateBalance().balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              ${calculateBalance().balance.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Payment Status</span>
                            <Badge 
                              variant={calculateBalance().balance === 0 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {calculateBalance().balance === 0 ? 'Paid in Full' : 'Outstanding'}
                            </Badge>
                          </div>
                        </div>

                        {/* Recent Payments */}
                        {participantPayments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Recent Payments</h4>
                            <div className="space-y-2">
                              {participantPayments.slice(0, 2).map((payment) => (
                                <div 
                                  key={payment.id} 
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleViewPayment(payment)}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                      payment.paymentStatus === 'completed' ? 'bg-green-500' :
                                      payment.paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                    <span className="text-xs font-medium">${payment.amount.toFixed(2)}</span>
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    {payment.paymentDate 
                                      ? new Date(payment.paymentDate).toLocaleDateString()
                                      : 'Pending'
                                    }
                                  </span>
                                </div>
                              ))}
                              {participantPayments.length > 2 && (
                                <div className="text-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs h-6"
                                    onClick={() => {
                                      // Switch to payments tab
                                      const paymentsTab = document.querySelector('[value="payments"]') as HTMLElement
                                      paymentsTab?.click()
                                    }}
                                  >
                                    View All ({participantPayments.length})
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Forms Status */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <FileText className="h-4 w-4 text-purple-600 mr-2" />
                          Required Forms Status
                        </h3>
                        <span className="text-xs text-gray-500">
                          {participantForms.filter(f => f.status === 'complete').length} of {participantForms.length} complete
                        </span>
                      </div>

                      {participantForms.length === 0 ? (
                        <div className="text-center py-6">
                          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">No forms assigned yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {participantForms.map((form) => {
                            const getFormIcon = (type: Form['formType']) => {
                              const icons = {
                                registration: User,
                                medical: Heart,
                                emergency: Shield,
                                waiver: FileText,
                                photo_consent: Eye,
                                transportation: Bus,
                                activity_consent: CheckCircle,
                                custom: FileText
                              }
                              return icons[type] || FileText
                            }

                            const getFormTitle = (form: Form) => {
                              if (form.title) return form.title
                              const titles = {
                                registration: 'Registration Form',
                                medical: 'Medical Information',
                                emergency: 'Emergency Contact',
                                waiver: 'Liability Waiver',
                                photo_consent: 'Photo Consent',
                                transportation: 'Transportation Form',
                                activity_consent: 'Activity Consent',
                                custom: 'Custom Form'
                              }
                              return titles[form.formType] || 'Unknown Form'
                            }

                            const FormIcon = getFormIcon(form.formType)

                            return (
                              <div 
                                key={form.id} 
                                className={`p-3 rounded-lg border flex items-center justify-between ${
                                  form.status === 'complete' ? 'bg-green-50 border-green-200' :
                                  form.status === 'pending_review' ? 'bg-yellow-50 border-yellow-200' :
                                  'bg-red-50 border-red-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  <FormIcon className={`h-4 w-4 mr-3 ${
                                    form.status === 'complete' ? 'text-green-600' :
                                    form.status === 'pending_review' ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`} />
                                  <div>
                                    <p className="text-sm font-medium">{getFormTitle(form)}</p>
                                    <p className="text-xs text-gray-600">
                                      {form.status === 'complete' && form.completedAt 
                                        ? `Completed ${new Date(form.completedAt).toLocaleDateString()}`
                                        : form.status === 'pending_review' ? 'Pending Review'
                                        : 'Incomplete'
                                      }
                                    </p>
                                  </div>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${
                                  form.status === 'complete' ? 'bg-green-500' :
                                  form.status === 'pending_review' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`} />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Medical & Emergency Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3 flex items-center">
                          <Heart className="h-4 w-4 text-pink-600 mr-2" />
                          Medical & Dietary
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center mb-2">
                              <AlertTriangle className="h-3 w-3 text-orange-600 mr-2" />
                              <span className="text-xs font-medium text-gray-700">Medical Conditions</span>
                            </div>
                            <div className="p-2 bg-orange-50 rounded text-xs">
                              {participant?.medicalConditions || 'No medical conditions reported'}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <Heart className="h-3 w-3 text-green-600 mr-2" />
                              <span className="text-xs font-medium text-gray-700">Dietary Restrictions</span>
                            </div>
                            <div className="p-2 bg-green-50 rounded text-xs">
                              {participant?.dietaryRestrictions || 'No dietary restrictions reported'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3 flex items-center">
                          <Shield className="h-4 w-4 text-red-600 mr-2" />
                          Emergency Contact
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Contact Name</span>
                            <span className="text-sm font-medium">{participant?.emergencyContactName || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Contact Phone</span>
                            <span className="text-sm font-medium">{participant?.emergencyContactPhone || 'N/A'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4 mt-3">
                  {/* Balance Overview & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Balance Cards */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-500 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div className="ml-3">
                              <p className="text-xs font-medium text-green-700">Total Paid</p>
                              <p className="text-xl font-bold text-green-900">
                                ${calculateBalance().totalPaid.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="p-2 bg-orange-500 rounded-lg">
                              <Clock className="h-4 w-4 text-white" />
                            </div>
                            <div className="ml-3">
                              <p className="text-xs font-medium text-orange-700">Outstanding</p>
                              <p className="text-xl font-bold text-orange-900">
                                ${calculateBalance().balance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <DollarSign className="h-4 w-4 text-white" />
                            </div>
                            <div className="ml-3">
                              <p className="text-xs font-medium text-blue-700">Total Due</p>
                              <p className="text-xl font-bold text-blue-900">
                                ${calculateBalance().totalDue.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card className="bg-gradient-to-r from-slate-50 to-gray-100 border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment Management</h3>
                          <p className="text-xs text-gray-600">Add new payments or view payment history</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={handleAddPayment}
                            className="text-xs h-8"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Payment
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm" 
                            className="text-xs h-8"
                            onClick={() => {
                              // Future: Export payments functionality
                              console.log('Export payments for participant:', participant?.id)
                            }}
                          >
                            <Receipt className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment History */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Receipt className="h-4 w-4 text-purple-600 mr-2" />
                          Payment History ({participantPayments.length})
                        </h3>
                        {participantPayments.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {participantPayments.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <CreditCard className="h-8 w-8 text-gray-400" />
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">No payments recorded</h4>
                            <p className="text-xs text-gray-600 mb-4">Get started by adding the first payment for this participant</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleAddPayment}
                              className="text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add First Payment
                            </Button>
                          </div>
                        ) : (
                          participantPayments.map((payment) => {
                            const getPaymentStatusColor = (status: Payment['paymentStatus']) => {
                              const colors = {
                                completed: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100',
                                pending: 'text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                                failed: 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100',
                                refunded: 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }
                              return colors[status]
                            }

                            const getPaymentStatusIcon = (status: Payment['paymentStatus']) => {
                              const icons = {
                                completed: CheckCircle,
                                pending: Clock,
                                failed: XCircle,
                                refunded: TrendingDown
                              }
                              return icons[status] || Clock
                            }

                            const StatusIcon = getPaymentStatusIcon(payment.paymentStatus)

                            return (
                              <div 
                                key={payment.id} 
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${getPaymentStatusColor(payment.paymentStatus)}`}
                                onClick={() => handleViewPayment(payment)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                      <StatusIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-3 mb-1">
                                        <span className="text-lg font-bold">
                                          ${payment.amount.toFixed(2)}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {payment.paymentMethod || 'N/A'}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center space-x-4 text-xs">
                                        <span>
                                          {payment.paymentDate 
                                            ? `Paid ${new Date(payment.paymentDate).toLocaleDateString()}`
                                            : payment.dueDate 
                                              ? `Due ${new Date(payment.dueDate).toLocaleDateString()}`
                                              : 'No date set'
                                          }
                                        </span>
                                        {payment.transactionId && (
                                          <span className="font-mono text-gray-500">
                                            ID: {payment.transactionId.slice(-8)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge 
                                      variant={payment.paymentStatus === 'completed' ? 'default' : 
                                              payment.paymentStatus === 'pending' ? 'secondary' : 
                                              payment.paymentStatus === 'failed' ? 'destructive' : 'outline'}
                                      className="text-xs capitalize"
                                    >
                                      {payment.paymentStatus}
                                    </Badge>
                                  </div>
                                </div>
                                {payment.notes && (
                                  <div className="mt-3 pt-3 border-t border-white/50">
                                    <p className="text-xs opacity-80 line-clamp-2">
                                      {payment.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="forms" className="space-y-3 mt-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <FileText className="h-4 w-4 text-purple-600 mr-2" />
                          Required Forms ({participantForms.length})
                        </h3>
                        <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          <span className="font-medium">Forms set by registration - status only</span>
                        </div>
                      </div>

                      {/* Forms List */}
                      <div className="space-y-3">
                        {participantForms.length === 0 ? (
                          <div className="text-center py-6">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-3">No forms assigned yet</p>
                            <p className="text-xs text-gray-500">Forms are set by the registration - check registration settings</p>
                          </div>
                        ) : (
                          participantForms.map((form) => {
                            const getFormIcon = (type: Form['formType']) => {
                              const icons = {
                                registration: User,
                                medical: Heart,
                                emergency: Shield,
                                waiver: FileText,
                                photo_consent: Eye,
                                transportation: Bus,
                                activity_consent: CheckCircle,
                                custom: FileText
                              }
                              return icons[type] || FileText
                            }

                            const getFormColor = (status: Form['status']) => {
                              const colors = {
                                incomplete: 'text-red-600 bg-red-50 border-red-200',
                                complete: 'text-green-600 bg-green-50 border-green-200',
                                pending_review: 'text-yellow-600 bg-yellow-50 border-yellow-200'
                              }
                              return colors[status]
                            }

                            const getFormTitle = (form: Form) => {
                              if (form.title) return form.title
                              const titles = {
                                registration: 'Registration Form',
                                medical: 'Medical Information',
                                emergency: 'Emergency Contact',
                                waiver: 'Liability Waiver',
                                photo_consent: 'Photo Consent',
                                transportation: 'Transportation Form',
                                activity_consent: 'Activity Consent',
                                custom: 'Custom Form'
                              }
                              return titles[form.formType] || 'Unknown Form'
                            }

                            const FormIcon = getFormIcon(form.formType)

                            return (
                              <div key={form.id} className={`p-3 rounded-lg border ${getFormColor(form.status)}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <FormIcon className="h-4 w-4" />
                                    <div>
                                      <p className="text-sm font-medium">{getFormTitle(form)}</p>
                                      <p className="text-xs opacity-75">
                                        {form.status === 'complete' && form.completedAt 
                                          ? `Completed ${new Date(form.completedAt).toLocaleDateString()}`
                                          : `Created ${new Date(form.createdAt).toLocaleDateString()}`
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Select 
                                      value={form.status} 
                                      onValueChange={async (value) => {
                                        const updatedForm = {
                                          ...form,
                                          status: value as Form['status'],
                                          completedAt: value === 'complete' ? new Date().toISOString() : undefined,
                                          updatedAt: new Date().toISOString()
                                        }
                                        
                                        // Update local state immediately
                                        setParticipantForms(prev => 
                                          prev.map(f => f.id === form.id ? updatedForm : f)
                                        )
                                        
                                        // In a real app, save to database:
                                        // await blink.db.forms.update(form.id, updatedForm)
                                        console.log('Form status updated:', updatedForm)
                                      }}
                                    >
                                      <SelectTrigger className="h-7 w-32 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="incomplete">Incomplete</SelectItem>
                                        <SelectItem value="complete">Complete</SelectItem>
                                        <SelectItem value="pending_review">Pending Review</SelectItem>
                                      </SelectContent>
                                    </Select>

                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>

                      {/* Form Completion Summary */}
                      {participantForms.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">Form Completion</span>
                            <span className="text-xs text-blue-700">
                              {participantForms.filter(f => f.status === 'complete').length} of {participantForms.length} complete
                            </span>
                          </div>
                          <Progress 
                            value={(participantForms.filter(f => f.status === 'complete').length / participantForms.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="personal" className="space-y-3 mt-3">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center">
                        <User className="h-4 w-4 text-blue-600 mr-2" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Email</p>
                            <p className="text-sm text-gray-900">{participant?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Phone</p>
                            <p className="text-sm text-gray-900">{participant?.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center">
                        <Heart className="h-4 w-4 text-pink-600 mr-2" />
                        Medical & Dietary
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="h-3 w-3 text-orange-600 mr-2" />
                            <span className="text-xs font-medium text-gray-700">Medical Conditions</span>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-sm text-gray-900">
                              {participant?.medicalConditions || 'No medical conditions reported'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <Heart className="h-3 w-3 text-green-600 mr-2" />
                            <span className="text-xs font-medium text-gray-700">Dietary Restrictions</span>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-900">
                              {participant?.dietaryRestrictions || 'No dietary restrictions reported'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emergency" className="space-y-3 mt-3">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center">
                        <Shield className="h-4 w-4 text-red-600 mr-2" />
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <User className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Contact Name</p>
                            <p className="text-sm text-gray-900">{participant?.emergencyContactName || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <Phone className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Contact Phone</p>
                            <p className="text-sm text-gray-900">{participant?.emergencyContactPhone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-3 mt-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3 flex items-center">
                          <Home className="h-4 w-4 text-blue-600 mr-2" />
                          Cabin Assignment
                        </h3>
                        <div className="text-center py-6">
                          <Home className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 mb-3">No cabin assigned</p>
                          <Button variant="outline" size="sm" className="text-xs">
                            Assign Cabin
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3 flex items-center">
                          <Bus className="h-4 w-4 text-green-600 mr-2" />
                          Transportation
                        </h3>
                        <div className="text-center py-6">
                          <Bus className="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 mb-3">No transportation assigned</p>
                          <Button variant="outline" size="sm" className="text-xs">
                            Assign Transportation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
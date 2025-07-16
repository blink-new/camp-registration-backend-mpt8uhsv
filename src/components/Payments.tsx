import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  DollarSign, 
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  Edit,
  ArrowLeft,
  Users
} from 'lucide-react'
import { Payment } from '@/types'
import { PaymentModal } from './PaymentModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRegistration } from '@/contexts/RegistrationContext'

// Mock data - filtered by registrationId
const mockPayments: Payment[] = [
  {
    id: '1',
    userId: 'user1',
    registrationId: '1', // Summer Adventure Camp
    participantId: '1',
    amount: 450.00,
    paymentMethod: 'Credit Card',
    paymentStatus: 'completed',
    transactionId: 'txn_1234567890',
    paymentDate: '2024-01-15T15:30:00Z',
    dueDate: '2024-01-20',
    notes: 'Full camp fee payment',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T15:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    registrationId: '1', // Summer Adventure Camp
    participantId: '2',
    amount: 450.00,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'pending',
    transactionId: '',
    paymentDate: '',
    dueDate: '2024-01-25',
    notes: 'Awaiting bank transfer confirmation',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    registrationId: '1', // Summer Adventure Camp
    participantId: '3',
    amount: 225.00,
    paymentMethod: 'Credit Card',
    paymentStatus: 'completed',
    transactionId: 'txn_0987654321',
    paymentDate: '2024-01-17T11:45:00Z',
    dueDate: '2024-01-22',
    notes: 'Partial payment - 50% deposit',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T11:45:00Z'
  },
  {
    id: '4',
    userId: 'user3',
    registrationId: '1', // Summer Adventure Camp
    participantId: '3',
    amount: 225.00,
    paymentMethod: 'Credit Card',
    paymentStatus: 'failed',
    transactionId: '',
    paymentDate: '',
    dueDate: '2024-02-01',
    notes: 'Card declined - insufficient funds',
    createdAt: '2024-01-20T16:30:00Z',
    updatedAt: '2024-01-20T16:30:00Z'
  },
  {
    id: '5',
    userId: 'user4',
    registrationId: '2', // Winter Sports Camp
    participantId: '4',
    amount: 650.00,
    paymentMethod: 'Credit Card',
    paymentStatus: 'completed',
    transactionId: 'txn_5555666677',
    paymentDate: '2024-01-21T10:15:00Z',
    dueDate: '2024-01-25',
    notes: 'Full winter camp payment',
    createdAt: '2024-01-21T08:30:00Z',
    updatedAt: '2024-01-21T10:15:00Z'
  }
]

// Mock participant names for display
const participantNames: Record<string, string> = {
  '1': 'Sarah Johnson',
  '2': 'Michael Chen',
  '3': 'Emma Davis',
  '4': 'James Wilson',
  '5': 'Olivia Martinez'
}

export function Payments() {
  const { selectedRegistration } = useRegistration()
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [selectedRegistration])

  const loadPayments = async () => {
    if (!selectedRegistration) {
      setPayments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // In a real app: const data = await blink.db.payments.list({ where: { registrationId: selectedRegistration.id } })
      const filteredPayments = mockPayments.filter(p => p.registrationId === selectedRegistration.id)
      setPayments(filteredPayments)
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      participantNames[payment.participantId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Payment['paymentStatus']) => {
    const config = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      failed: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      refunded: { variant: 'outline' as const, icon: RefreshCw, color: 'text-gray-600' }
    }

    const { variant, icon: Icon, color } = config[status]

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTotalStats = () => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const completed = payments.filter(p => p.paymentStatus === 'completed').reduce((sum, payment) => sum + payment.amount, 0)
    const pending = payments.filter(p => p.paymentStatus === 'pending').reduce((sum, payment) => sum + payment.amount, 0)
    const failed = payments.filter(p => p.paymentStatus === 'failed').reduce((sum, payment) => sum + payment.amount, 0)

    return { total, completed, pending, failed }
  }

  const stats = getTotalStats()

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreatePayment = () => {
    setSelectedPayment(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleSavePayment = (paymentData: Payment) => {
    if (modalMode === 'create') {
      // Add registrationId to new payment
      const newPayment = {
        ...paymentData,
        registrationId: selectedRegistration?.id || ''
      }
      setPayments(prev => [...prev, newPayment])
    } else {
      setPayments(prev => 
        prev.map(p => p.id === paymentData.id ? paymentData : p)
      )
    }
    setIsModalOpen(false)
    setSelectedPayment(null)
  }

  // Show message if no registration is selected
  if (!selectedRegistration) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Registration Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select a camp registration from the Registrations page to view and manage payments.
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
      {/* Header with Registration Context */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">
            Track and manage payments for the selected camp registration
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Managing payments for:</p>
                <p className="text-blue-800 font-semibold">{selectedRegistration.name}</p>
                <p className="text-sm text-blue-700">
                  Camp Fee: ${selectedRegistration.campFee.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">{payments.length}</p>
                <p className="text-sm text-blue-700">payments</p>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleCreatePayment} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.total.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">${stats.completed.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">${stats.pending.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">${stats.failed.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table - Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">
                        {participantNames[payment.participantId] || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{payment.amount.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        {payment.paymentMethod || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Pending'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPayment(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payments Cards - Mobile */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Payments ({filteredPayments.length})</h2>
        </div>
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {participantNames[payment.participantId] || 'Unknown'}
                  </h3>
                  <div className="flex items-center text-lg font-bold text-gray-900 mt-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {payment.amount.toFixed(2)}
                  </div>
                </div>
                {getStatusBadge(payment.paymentStatus)}
              </div>

              {/* Payment Method */}
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="h-3 w-3 mr-2 text-gray-400" />
                {payment.paymentMethod || 'N/A'}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                    Due: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                    Paid: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Pending'}
                  </div>
                </div>
              </div>

              {/* Transaction ID */}
              {payment.transactionId && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono break-all">
                  {payment.transactionId}
                </div>
              )}

              {/* Notes */}
              {payment.notes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {payment.notes}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewPayment(payment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditPayment(payment)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        payment={selectedPayment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePayment}
        mode={modalMode}
        participantNames={participantNames}
      />
    </div>
  )
}
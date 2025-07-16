import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit3,
  Save,
  X,
  Receipt,
  User,
  FileText,
  TrendingUp
} from 'lucide-react'
import { Payment } from '@/types'

interface PaymentModalProps {
  payment: Payment | null
  isOpen: boolean
  onClose: () => void
  onSave: (payment: Payment) => void
  mode: 'view' | 'edit' | 'create'
  participantNames: Record<string, string>
}

export function PaymentModal({ payment, isOpen, onClose, onSave, mode, participantNames }: PaymentModalProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
  const [formData, setFormData] = useState<Partial<Payment>>({})

  useEffect(() => {
    if (payment) {
      setFormData(payment)
    } else if (mode === 'create') {
      setFormData({
        participantId: '',
        amount: 0,
        paymentMethod: '',
        paymentStatus: 'pending',
        transactionId: '',
        paymentDate: '',
        dueDate: '',
        notes: ''
      })
    }
    setIsEditing(mode === 'edit' || mode === 'create')
  }, [payment, mode])

  const handleSave = () => {
    if (formData.participantId && formData.amount) {
      const paymentData: Payment = {
        id: payment?.id || `payment_${Date.now()}`,
        userId: 'current_user',
        participantId: formData.participantId!,
        amount: Number(formData.amount!),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus || 'pending',
        transactionId: formData.transactionId,
        paymentDate: formData.paymentDate,
        dueDate: formData.dueDate,
        notes: formData.notes,
        createdAt: payment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      onSave(paymentData)
      setIsEditing(false)
    }
  }

  const getStatusBadge = (status: Payment['paymentStatus']) => {
    const variants = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      refunded: { color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
    }

    const config = variants[status]
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    )
  }

  const getPaymentMethodIcon = (method?: string) => {
    if (!method) return CreditCard
    if (method.toLowerCase().includes('credit') || method.toLowerCase().includes('card')) return CreditCard
    if (method.toLowerCase().includes('bank') || method.toLowerCase().includes('transfer')) return TrendingUp
    return CreditCard
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 shadow-2xl border-0">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {mode === 'create' ? 'Add New Payment' : 
               isEditing ? 'Edit Payment' : 'Payment Details'}
            </DialogTitle>
            {mode !== 'create' && !isEditing && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
                className="ml-4"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isEditing ? (
            // Edit Form
            <div className="space-y-6 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="participantId">Participant *</Label>
                    <Select 
                      value={formData.participantId || ''} 
                      onValueChange={(value) => setFormData({ ...formData, participantId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(participantNames).map(([id, name]) => (
                          <SelectItem key={id} value={id}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select 
                      value={formData.paymentMethod || ''} 
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Status</Label>
                    <Select 
                      value={formData.paymentStatus || 'pending'} 
                      onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as Payment['paymentStatus'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      value={formData.transactionId || ''}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="datetime-local"
                      value={formData.paymentDate ? new Date(formData.paymentDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Enter any notes about this payment"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  if (mode === 'create') {
                    onClose()
                  } else {
                    setIsEditing(false)
                    setFormData(payment || {})
                  }
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Payment' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6 p-1">
              {/* Header with Amount and Status */}
              <div className="flex items-start justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      ${payment?.amount.toFixed(2)}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {participantNames[payment?.participantId || ''] || 'Unknown Participant'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {payment?.paymentStatus && getStatusBadge(payment.paymentStatus)}
                </div>
              </div>

              {/* Tabs for organized information */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details" className="flex items-center">
                    <Receipt className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="transaction" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Transaction
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Participant</p>
                              <p className="text-gray-900">{participantNames[payment?.participantId || ''] || 'Unknown'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Amount</p>
                              <p className="text-gray-900 text-lg font-semibold">${payment?.amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              {payment?.paymentMethod && React.createElement(getPaymentMethodIcon(payment.paymentMethod), {
                                className: "h-4 w-4 text-purple-600"
                              })}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Payment Method</p>
                              <p className="text-gray-900">{payment?.paymentMethod || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Calendar className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Due Date</p>
                              <p className="text-gray-900">
                                {payment?.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {payment?.notes && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-gray-600" />
                          Notes
                        </h3>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-900">{payment.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="transaction" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                        Transaction Details
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Receipt className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                              <p className="text-gray-900 font-mono text-sm">
                                {payment?.transactionId || 'Not available'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Payment Date</p>
                              <p className="text-gray-900">
                                {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'Pending'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {payment?.paymentStatus === 'completed' && payment?.transactionId && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-green-800 font-medium">Payment Confirmed</span>
                            </div>
                            <p className="text-green-700 text-sm mt-1">
                              This payment has been successfully processed and confirmed.
                            </p>
                          </div>
                        )}

                        {payment?.paymentStatus === 'failed' && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                              <span className="text-red-800 font-medium">Payment Failed</span>
                            </div>
                            <p className="text-red-700 text-sm mt-1">
                              This payment could not be processed. Please check the payment details and try again.
                            </p>
                          </div>
                        )}

                        {payment?.paymentStatus === 'pending' && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                              <span className="text-yellow-800 font-medium">Payment Pending</span>
                            </div>
                            <p className="text-yellow-700 text-sm mt-1">
                              This payment is currently being processed. Please allow 1-3 business days for completion.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-600" />
                        Payment History
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-1 bg-blue-100 rounded-full">
                            <Calendar className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Payment Created</p>
                            <p className="text-xs text-gray-600">
                              {payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {payment?.updatedAt && payment.updatedAt !== payment.createdAt && (
                          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-1 bg-green-100 rounded-full">
                              <Edit3 className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Payment Updated</p>
                              <p className="text-xs text-gray-600">
                                {new Date(payment.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                        {payment?.paymentDate && (
                          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="p-1 bg-green-100 rounded-full">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Payment Processed</p>
                              <p className="text-xs text-gray-600">
                                {new Date(payment.paymentDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
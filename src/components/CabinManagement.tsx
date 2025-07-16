import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Plus, 
  Home, 
  Users,
  Eye,
  Edit,
  UserPlus,
  UserMinus,
  Building,
  Bed,
  Shield,
  MoreHorizontal,
  MapPin
} from 'lucide-react'
import { Cabin, CabinAssignment, Participant } from '@/types'
import { useRegistration } from '@/contexts/RegistrationContext'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for cabins
const mockCabins: Cabin[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Pine Lodge',
    capacity: 8,
    currentOccupancy: 6,
    cabinType: 'standard',
    description: 'Cozy cabin with lake view, perfect for younger campers',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Eagle\'s Nest',
    capacity: 6,
    currentOccupancy: 4,
    cabinType: 'premium',
    description: 'Premium cabin with mountain views and private bathroom',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Accessible Haven',
    capacity: 4,
    currentOccupancy: 2,
    cabinType: 'accessible',
    description: 'Fully accessible cabin with wheelchair ramps and adapted facilities',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
]

interface CabinModalProps {
  cabin: Cabin | null
  isOpen: boolean
  onClose: () => void
  onSave: (cabin: Cabin) => void
  mode: 'view' | 'edit' | 'create'
}

function CabinModal({ cabin, isOpen, onClose, onSave, mode }: CabinModalProps) {
  const [formData, setFormData] = useState<Partial<Cabin>>({})

  useEffect(() => {
    if (cabin) {
      setFormData(cabin)
    } else if (mode === 'create') {
      setFormData({
        name: '',
        capacity: 4,
        currentOccupancy: 0,
        cabinType: 'standard',
        description: ''
      })
    }
  }, [cabin, mode])

  const handleSave = () => {
    if (formData.name && formData.capacity) {
      const cabinData: Cabin = {
        id: cabin?.id || `cabin_${Date.now()}`,
        userId: 'current_user',
        name: formData.name!,
        capacity: formData.capacity!,
        currentOccupancy: formData.currentOccupancy || 0,
        cabinType: formData.cabinType || 'standard',
        description: formData.description,
        createdAt: cabin?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      onSave(cabinData)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Cabin' : 
             mode === 'edit' ? 'Edit Cabin' : 'Cabin Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Cabin Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter cabin name"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="4"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="cabinType">Cabin Type</Label>
                <Select 
                  value={formData.cabinType || 'standard'} 
                  onValueChange={(value) => setFormData({ ...formData, cabinType: value as Cabin['cabinType'] })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="accessible">Accessible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentOccupancy">Current Occupancy</Label>
                <Input
                  id="currentOccupancy"
                  type="number"
                  min="0"
                  value={formData.currentOccupancy || ''}
                  onChange={(e) => setFormData({ ...formData, currentOccupancy: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter cabin description"
                  rows={4}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {mode === 'create' ? 'Create Cabin' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CabinManagement() {
  const { selectedRegistration } = useRegistration()
  const [cabins, setCabins] = useState<Cabin[]>(mockCabins)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredCabins = cabins.filter(cabin => {
    const matchesSearch = 
      cabin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || cabin.cabinType === typeFilter
    
    return matchesSearch && matchesType
  })

  const getCabinTypeBadge = (type: Cabin['cabinType']) => {
    const configs = {
      standard: { variant: 'secondary' as const, color: 'text-blue-700 bg-blue-100' },
      premium: { variant: 'default' as const, color: 'text-purple-700 bg-purple-100' },
      accessible: { variant: 'outline' as const, color: 'text-green-700 bg-green-100' }
    }

    const config = configs[type]

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    )
  }

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 100) return 'text-red-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleViewCabin = (cabin: Cabin) => {
    setSelectedCabin(cabin)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleEditCabin = (cabin: Cabin) => {
    setSelectedCabin(cabin)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreateCabin = () => {
    setSelectedCabin(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleSaveCabin = (cabinData: Cabin) => {
    if (modalMode === 'create') {
      setCabins(prev => [...prev, cabinData])
    } else {
      setCabins(prev => 
        prev.map(c => c.id === cabinData.id ? cabinData : c)
      )
    }
    setIsModalOpen(false)
    setSelectedCabin(null)
  }

  const getStats = () => {
    return {
      total: cabins.length,
      totalCapacity: cabins.reduce((sum, c) => sum + c.capacity, 0),
      totalOccupancy: cabins.reduce((sum, c) => sum + c.currentOccupancy, 0),
      available: cabins.reduce((sum, c) => sum + (c.capacity - c.currentOccupancy), 0),
      fullCabins: cabins.filter(c => c.currentOccupancy >= c.capacity).length
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cabin Management</h1>
          <p className="text-gray-600 mt-2">
            Manage cabin assignments and occupancy for camp participants
          </p>
          {selectedRegistration && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Managing cabins for:</p>
                  <p className="text-blue-800">{selectedRegistration.name}</p>
                </div>
                <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                  {stats.totalOccupancy}/{stats.totalCapacity} occupied
                </Badge>
              </div>
            </div>
          )}
        </div>
        <Button 
          onClick={handleCreateCabin}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Cabin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-sm text-blue-700">Total Cabins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg mr-3">
                <Bed className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.totalCapacity}</p>
                <p className="text-sm text-green-700">Total Capacity</p>
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
                <p className="text-2xl font-bold text-purple-900">{stats.totalOccupancy}</p>
                <p className="text-sm text-purple-700">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.available}</p>
                <p className="text-sm text-yellow-700">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.fullCabins}</p>
                <p className="text-sm text-red-700">Full</p>
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
                placeholder="Search cabins by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="accessible">Accessible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cabins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCabins.map((cabin) => (
          <Card key={cabin.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{cabin.name}</h3>
                    <div className="flex items-center mt-2">
                      {getCabinTypeBadge(cabin.cabinType)}
                    </div>
                  </div>
                  {cabin.currentOccupancy >= cabin.capacity ? (
                    <Badge variant="destructive">Full</Badge>
                  ) : cabin.currentOccupancy > 0 ? (
                    <Badge variant="secondary">Partial</Badge>
                  ) : (
                    <Badge variant="outline">Empty</Badge>
                  )}
                </div>

                {/* Occupancy Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Occupancy</span>
                    <span className={`font-medium ${getOccupancyColor(cabin.currentOccupancy, cabin.capacity)}`}>
                      {cabin.currentOccupancy}/{cabin.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        cabin.currentOccupancy >= cabin.capacity ? 'bg-red-500' :
                        cabin.currentOccupancy >= cabin.capacity * 0.8 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((cabin.currentOccupancy / cabin.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                {cabin.description && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {cabin.description}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => handleViewCabin(cabin)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 hover:bg-green-50 hover:border-green-200"
                    onClick={() => handleEditCabin(cabin)}
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

      {/* Cabin Modal */}
      <CabinModal
        cabin={selectedCabin}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCabin}
        mode={modalMode}
      />
    </div>
  )
}
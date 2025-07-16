import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Home, 
  Bus,
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRegistration } from '@/contexts/RegistrationContext'
import { blink } from '@/blink/client'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'registrations', name: 'Registrations', icon: FileText },
  { id: 'participants', name: 'Participants', icon: Users },
  { id: 'payments', name: 'Payments', icon: CreditCard },
  { id: 'cabins', name: 'Cabins', icon: Home },
  { id: 'transportation', name: 'Transportation', icon: Bus },
  { id: 'reports', name: 'Reports', icon: BarChart3 },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedRegistration, setSelectedRegistration, registrations, setRegistrations } = useRegistration()

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      // Mock data - in a real app: const data = await blink.db.registrations.list()
      const mockRegistrations = [
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
          status: 'open' as const,
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
          status: 'draft' as const,
          location: 'Mountain View Resort',
          ageMin: 12,
          ageMax: 18,
          requiredForms: ['registration', 'medical', 'emergency', 'waiver', 'activity_consent'],
          createdAt: '2024-01-20T14:20:00Z',
          updatedAt: '2024-01-20T14:20:00Z'
        }
      ]
      setRegistrations(mockRegistrations)
      
      // Auto-select first registration if none selected
      if (!selectedRegistration && mockRegistrations.length > 0) {
        setSelectedRegistration(mockRegistrations[0])
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Camp Manager</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Registration Selection */}
          <div className="px-4 py-3 border-b border-gray-200">
            <Select
              value={selectedRegistration?.id || ''}
              onValueChange={(value) => {
                const registration = registrations.find(r => r.id === value)
                if (registration) setSelectedRegistration(registration)
              }}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select registration..." />
              </SelectTrigger>
              <SelectContent>
                {registrations.map((registration) => (
                  <SelectItem key={registration.id} value={registration.id}>
                    {registration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Camp Registration System v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
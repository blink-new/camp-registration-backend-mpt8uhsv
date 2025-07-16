import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  FileText, 
  CreditCard, 
  Home, 
  Bus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Building
} from 'lucide-react'
import { DashboardStats } from '@/types'
import { useRegistration } from '@/contexts/RegistrationContext'

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalParticipants: 156,
  pendingRegistrations: 23,
  completedPayments: 98,
  pendingPayments: 35,
  completedForms: 142,
  pendingForms: 14,
  cabinOccupancy: 78,
  transportationOccupancy: 65
}

const mockRecentActivity = [
  {
    id: '1',
    type: 'registration',
    message: 'New registration from Sarah Johnson',
    time: '2 minutes ago',
    status: 'pending'
  },
  {
    id: '2',
    type: 'payment',
    message: 'Payment completed for Michael Chen',
    time: '15 minutes ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'assignment',
    message: 'Cabin assignment updated for Emma Davis',
    time: '1 hour ago',
    status: 'completed'
  },
  {
    id: '4',
    type: 'form',
    message: 'Medical form submitted by Alex Rodriguez',
    time: '2 hours ago',
    status: 'pending'
  }
]

export function Dashboard() {
  const { selectedRegistration } = useRegistration()
  const [stats] = useState<DashboardStats>(mockStats)

  const statCards = [
    {
      title: 'Total Participants',
      value: stats.totalParticipants,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Pending Registrations',
      value: stats.pendingRegistrations,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5',
      changeType: 'neutral' as const
    },
    {
      title: 'Completed Payments',
      value: stats.completedPayments,
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-3',
      changeType: 'positive' as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {selectedRegistration 
            ? `Overview for ${selectedRegistration.name}` 
            : 'Overview of all camp registration activities and key metrics'
          }
        </p>
      </div>

      {/* Registration Info */}
      {selectedRegistration && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-900">{selectedRegistration.name}</h2>
                  <div className="flex items-center text-sm text-blue-700 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(selectedRegistration.startDate).toLocaleDateString()} - {new Date(selectedRegistration.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor || 'bg-gray-50'}`}>
                    <Icon className={`h-6 w-6 ${stat.color || 'text-gray-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'registration' ? 'bg-blue-50' :
                    activity.type === 'payment' ? 'bg-green-50' :
                    activity.type === 'assignment' ? 'bg-purple-50' :
                    'bg-orange-50'
                  }`}>
                    {activity.type === 'registration' && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-green-600" />}
                    {activity.type === 'assignment' && <Home className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'form' && <FileText className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status === 'completed' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
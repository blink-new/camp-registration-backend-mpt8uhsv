import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { Participants } from '@/components/ParticipantsWithRegistration'
import { Payments } from '@/components/Payments'
import { Registrations } from '@/components/Registrations'
import { Toaster } from '@/components/ui/toaster'
import { RegistrationProvider } from '@/contexts/RegistrationContext'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Camp Registration Manager</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access the camp registration management system.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'participants':
        return <Participants />
      case 'payments':
        return <Payments />
      case 'registrations':
        return <Registrations />
      case 'cabins':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cabin Management</h1>
            <p className="text-gray-600">Cabin assignment management coming soon...</p>
          </div>
        )
      case 'transportation':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transportation</h1>
            <p className="text-gray-600">Transportation management coming soon...</p>
          </div>
        )
      case 'reports':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Reporting and analytics coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main content with proper spacing for fixed sidebar */}
        <main className="lg:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl mx-auto">
            {/* User info bar */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{user.email}</span>
              </div>
              <button
                onClick={() => blink.auth.logout()}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
            
            {renderContent()}
          </div>
        </main>
        
        <Toaster />
      </div>
    </RegistrationProvider>
  )
}

export default App
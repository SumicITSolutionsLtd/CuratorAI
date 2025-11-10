import { ReactNode, useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Sync with sidebar collapsed state from localStorage
  useEffect(() => {
    const checkCollapsed = () => {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved) {
        setIsCollapsed(JSON.parse(saved))
      }
    }

    checkCollapsed()

    // Listen for storage changes
    window.addEventListener('storage', checkCollapsed)

    // Custom event for same-tab updates
    const handleSidebarToggle = () => checkCollapsed()
    window.addEventListener('sidebar-toggle', handleSidebarToggle)

    return () => {
      window.removeEventListener('storage', checkCollapsed)
      window.removeEventListener('sidebar-toggle', handleSidebarToggle)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content Area - Dynamic padding based on sidebar state */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
      >
        <TopBar />

        {/* Content with bottom padding for mobile nav */}
        <main className="flex-1 p-3 pb-24 sm:p-4 lg:pb-4">{children}</main>
      </div>
    </div>
  )
}

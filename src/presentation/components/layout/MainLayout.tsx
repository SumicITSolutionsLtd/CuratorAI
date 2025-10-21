import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content Area - Responsive padding for sidebar and mobile nav */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <TopBar />

        {/* Content with bottom padding for mobile nav */}
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}

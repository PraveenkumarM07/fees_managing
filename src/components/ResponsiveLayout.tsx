import React, { ReactNode } from 'react'
import { getDeviceType } from '../utils/deviceDetection'
import OfflineIndicator from './OfflineIndicator'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
}

export default function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  const deviceType = getDeviceType()

  return (
    <div className={`min-h-screen ${className}`}>
      <OfflineIndicator />
      
      {/* Device-specific layout adjustments */}
      <div className={`
        ${deviceType === 'mobile' ? 'px-4 py-2' : 'px-6 py-4'}
        ${deviceType === 'tablet' ? 'max-w-4xl mx-auto' : ''}
        ${deviceType === 'desktop' ? 'max-w-7xl mx-auto' : ''}
      `}>
        {children}
      </div>

      {/* Device indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 glass-effect rounded-lg px-3 py-2 text-white/60 text-xs">
          {deviceType} • {window.innerWidth}x{window.innerHeight}
        </div>
      )}
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, CloudOff } from 'lucide-react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOfflineMessage && isOnline) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isOnline ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'
    }`}>
      <div className={`glass-effect rounded-xl p-4 border-2 ${
        isOnline 
          ? 'border-green-500/30 bg-green-500/10' 
          : 'border-red-500/30 bg-red-500/10'
      }`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-300" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-300" />
          )}
          <div>
            <p className={`font-medium text-sm ${
              isOnline ? 'text-green-200' : 'text-red-200'
            }`}>
              {isOnline ? 'Back Online' : 'You\'re Offline'}
            </p>
            <p className="text-white/60 text-xs">
              {isOnline 
                ? 'Data will sync automatically' 
                : 'Using cached data'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
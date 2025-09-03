import React, { useState, useEffect } from 'react'
import { Smartphone, Monitor, Tablet, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function DeviceSync() {
  const { syncData } = useAuth()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Auto-sync every 30 seconds when online
    const syncInterval = setInterval(() => {
      if (isOnline && !syncing) {
        handleSync()
      }
    }, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(syncInterval)
    }
  }, [isOnline, syncing])

  const handleSync = async () => {
    if (!isOnline) return
    
    setSyncing(true)
    try {
      await syncData()
      setLastSync(new Date())
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  const getDeviceIcon = () => {
    const width = window.innerWidth
    if (width < 768) return <Smartphone className="w-5 h-5" />
    if (width < 1024) return <Tablet className="w-5 h-5" />
    return <Monitor className="w-5 h-5" />
  }

  return (
    <div className="glass-effect rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getDeviceIcon()}
          <div>
            <p className="text-white font-medium text-sm">Cross-Device Access</p>
            <p className="text-white/70 text-xs">
              {isOnline ? 'Connected' : 'Offline'} • 
              {lastSync ? ` Last sync: ${lastSync.toLocaleTimeString()}` : ' Never synced'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          
          <button
            onClick={handleSync}
            disabled={!isOnline || syncing}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {!isOnline && (
        <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
          <p className="text-red-200 text-sm">
            You're offline. Data will sync when connection is restored.
          </p>
        </div>
      )}
    </div>
  )
}
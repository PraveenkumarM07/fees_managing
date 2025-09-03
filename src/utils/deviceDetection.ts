export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  
  if (width < 768) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function getDeviceInfo() {
  return {
    type: getDeviceType(),
    isMobile: isMobileDevice(),
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isOnline: navigator.onLine,
    timestamp: new Date().toISOString()
  }
}

export function trackDeviceUsage(userId: string, action: string) {
  const deviceInfo = getDeviceInfo()
  const usageData = {
    userId,
    action,
    device: deviceInfo,
    timestamp: new Date().toISOString()
  }
  
  // Store usage data locally
  const existingData = JSON.parse(localStorage.getItem('deviceUsage') || '[]')
  existingData.push(usageData)
  
  // Keep only last 100 entries to prevent storage overflow
  if (existingData.length > 100) {
    existingData.splice(0, existingData.length - 100)
  }
  
  localStorage.setItem('deviceUsage', JSON.stringify(existingData))
  
  return usageData
}
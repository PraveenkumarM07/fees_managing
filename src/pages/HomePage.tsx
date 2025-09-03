import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Users, Smartphone, Monitor, Tablet, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          VEMU Fee Management
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Access your fee details from any device, anywhere. Seamlessly sync between computer, tablet, and phone.
        </p>
        
        {/* Device Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="glass-effect rounded-xl p-4 animate-pulse-slow">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <div className="glass-effect rounded-xl p-4 animate-pulse-slow" style={{ animationDelay: '1s' }}>
            <Tablet className="w-8 h-8 text-white" />
          </div>
          <div className="glass-effect rounded-xl p-4 animate-pulse-slow" style={{ animationDelay: '2s' }}>
            <Smartphone className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Login Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full animate-slide-up">
        {/* Student Login Card */}
        <Link to="/student/login" className="group">
          <div className="glass-effect rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Student Portal</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              View fee details, payment history, and submit transactions from any device
            </p>
            <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white transition-colors">
              <span>Access Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Employee Login Card */}
        <Link to="/employee/login" className="group">
          <div className="glass-effect rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Employee Portal</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Manage student records, verify transactions, and access admin tools
            </p>
            <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white transition-colors">
              <span>Access Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="mt-16 max-w-6xl w-full">
        <h3 className="text-2xl font-bold text-white text-center mb-8">Cross-Device Features</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Real-time Sync</h4>
            <p className="text-white/70 text-sm">Data automatically syncs across all your devices</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Secure Access</h4>
            <p className="text-white/70 text-sm">Bank-level security for all transactions</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Instant Updates</h4>
            <p className="text-white/70 text-sm">Get notified immediately when payments are processed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add missing imports
import { RefreshCw, Shield, Zap } from 'lucide-react'
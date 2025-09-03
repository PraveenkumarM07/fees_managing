import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { studentAPI } from '../services/api'
import DeviceSync from '../components/DeviceSync'
import { 
  CreditCard, 
  History, 
  FileText, 
  LogOut, 
  RefreshCw,
  DollarSign,
  Calendar,
  User,
  Building
} from 'lucide-react'

interface PaymentData {
  student: {
    name: string
    rollNumber: string
    branch: string
    academicYear: string
    totalFees: number
    paidAmount: number
    pendingAmount: number
  }
  yearWiseData: any
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [transactions, setTransactions] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user?.rollNumber) {
      fetchStudentData()
    }
  }, [user])

  const fetchStudentData = async () => {
    if (!user?.rollNumber) return

    try {
      setLoading(true)
      
      // Fetch payment details
      const paymentResponse = await studentAPI.getPaymentDetails(user.rollNumber)
      if (paymentResponse.data.success) {
        setPaymentData(paymentResponse.data)
        // Store data locally for offline access
        localStorage.setItem('studentData', JSON.stringify(paymentResponse.data))
      }

      // Fetch transactions
      const transactionsResponse = await studentAPI.getTransactions(user.rollNumber)
      if (transactionsResponse.data.success) {
        setTransactions(transactionsResponse.data.transactions)
      }

      // Fetch complaints
      const complaintsResponse = await studentAPI.getComplaints(user.rollNumber)
      if (complaintsResponse.data.success) {
        setComplaints(complaintsResponse.data.complaints)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      // Try to load from local storage if API fails
      const savedData = localStorage.getItem('studentData')
      if (savedData) {
        setPaymentData(JSON.parse(savedData))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome, {user?.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user?.rollNumber}
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {user?.branch}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {user?.academicYear}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Device Sync Component */}
        <DeviceSync />

        {/* Fee Overview Cards */}
        {paymentData && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Fees</p>
                  <p className="text-white font-bold text-xl">₹{paymentData.student.totalFees.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Paid Amount</p>
                  <p className="text-white font-bold text-xl">₹{paymentData.student.paidAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Pending Amount</p>
                  <p className="text-white font-bold text-xl">₹{paymentData.student.pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="glass-effect rounded-xl p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'transactions', label: 'Transactions', icon: History },
              { id: 'complaints', label: 'Complaints', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-effect rounded-2xl p-6">
          {activeTab === 'overview' && paymentData && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Fee Overview</h2>
              
              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                  style={{ 
                    width: `${(paymentData.student.paidAmount / paymentData.student.totalFees) * 100}%` 
                  }}
                ></div>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">Payment Progress</p>
                <p className="text-white font-bold text-lg">
                  {((paymentData.student.paidAmount / paymentData.student.totalFees) * 100).toFixed(1)}% Complete
                </p>
              </div>

              {/* Year-wise breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Year-wise Breakdown</h3>
                {Object.entries(paymentData.yearWiseData).map(([year, data]: [string, any]) => (
                  <div key={year} className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">{year}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Total</p>
                        <p className="text-white font-semibold">₹{data.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Paid</p>
                        <p className="text-green-300 font-semibold">₹{data.paid_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Pending</p>
                        <p className="text-orange-300 font-semibold">₹{data.pending_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Transaction History</h2>
                <button
                  onClick={fetchStudentData}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">{transaction.feeType}</p>
                          <p className="text-white/60 text-sm">ID: {transaction.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₹{transaction.amount.toLocaleString()}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'verified' 
                              ? 'bg-green-500/20 text-green-300' 
                              : transaction.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-white/50 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Complaints</h2>
              
              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No complaints submitted</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((complaint: any) => (
                    <div key={complaint.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">{complaint.subject}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.status === 'resolved' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{complaint.description}</p>
                      {complaint.response && (
                        <div className="bg-white/5 rounded-lg p-3 mt-3">
                          <p className="text-white/60 text-xs mb-1">Response:</p>
                          <p className="text-white text-sm">{complaint.response}</p>
                        </div>
                      )}
                      <p className="text-white/50 text-xs mt-2">
                        {new Date(complaint.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <button className="glass-effect rounded-xl p-4 text-left hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-white font-medium">Make Payment</p>
                <p className="text-white/60 text-sm">Submit new transaction</p>
              </div>
            </div>
          </button>

          <button className="glass-effect rounded-xl p-4 text-left hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="text-white font-medium">Submit Complaint</p>
                <p className="text-white/60 text-sm">Report an issue</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
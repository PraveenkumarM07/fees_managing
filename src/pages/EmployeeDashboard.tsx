import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { employeeAPI } from '../services/api'
import DeviceSync from '../components/DeviceSync'
import { 
  Users, 
  Search, 
  Filter, 
  LogOut, 
  RefreshCw,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  GraduationCap
} from 'lucide-react'

interface Student {
  name: string
  rollNumber: string
  branch: string
  academicYear: string
  category: string
  totalAmount: number
  paidAmount: number
  pendingAmount: number
}

export default function EmployeeDashboard() {
  const { user, logout } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    branch: '',
    academicYear: '',
    category: '',
    listType: ''
  })
  const [statistics, setStatistics] = useState({
    total: 0,
    paid: 0,
    pending: 0
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, filters])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await employeeAPI.getStudents()
      if (response.data.success) {
        setStudents(response.data.students)
        setStatistics(response.data.statistics)
        // Store data locally for offline access
        localStorage.setItem('employeeData', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      // Try to load from local storage if API fails
      const savedData = localStorage.getItem('employeeData')
      if (savedData) {
        const data = JSON.parse(savedData)
        setStudents(data.students || [])
        setStatistics(data.statistics || { total: 0, paid: 0, pending: 0 })
      }
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply other filters
    if (filters.branch) {
      filtered = filtered.filter(student => student.branch === filters.branch)
    }
    if (filters.academicYear) {
      filtered = filtered.filter(student => student.academicYear === filters.academicYear)
    }
    if (filters.category) {
      filtered = filtered.filter(student => student.category === filters.category)
    }
    if (filters.listType === 'paidFee') {
      filtered = filtered.filter(student => student.pendingAmount <= 0)
    } else if (filters.listType === 'pendingFee') {
      filtered = filtered.filter(student => student.pendingAmount > 0)
    }

    setFilteredStudents(filtered)
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Employee Dashboard
              </h1>
              <p className="text-white/70">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStudents}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Device Sync Component */}
        <DeviceSync />

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Students</p>
                <p className="text-white font-bold text-2xl">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Fees Paid</p>
                <p className="text-white font-bold text-2xl">{statistics.paid}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Pending Fees</p>
                <p className="text-white font-bold text-2xl">{statistics.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-effect rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <select
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Branches</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
            </select>

            <select
              value={filters.academicYear}
              onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Years</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>

            <select
              value={filters.listType}
              onChange={(e) => setFilters({ ...filters, listType: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Students</option>
              <option value="paidFee">Paid Fees</option>
              <option value="pendingFee">Pending Fees</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="glass-effect rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Student Records</h2>
              <p className="text-white/60">{filteredStudents.length} students found</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-white/80 font-medium">Student</th>
                  <th className="text-left p-4 text-white/80 font-medium">Branch</th>
                  <th className="text-left p-4 text-white/80 font-medium">Year</th>
                  <th className="text-left p-4 text-white/80 font-medium">Total Fees</th>
                  <th className="text-left p-4 text-white/80 font-medium">Paid</th>
                  <th className="text-left p-4 text-white/80 font-medium">Pending</th>
                  <th className="text-left p-4 text-white/80 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.rollNumber} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-white/60 text-sm">{student.rollNumber}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-white/60" />
                        <span className="text-white">{student.branch}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-white/60" />
                        <span className="text-white">{student.academicYear}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white font-medium">₹{student.totalAmount.toLocaleString()}</td>
                    <td className="p-4 text-green-300 font-medium">₹{student.paidAmount.toLocaleString()}</td>
                    <td className="p-4 text-orange-300 font-medium">₹{student.pendingAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        student.pendingAmount <= 0
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {student.pendingAmount <= 0 ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No students found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button className="glass-effect rounded-xl p-4 text-left hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-white font-medium">Add Student</p>
                <p className="text-white/60 text-sm">Register new student</p>
              </div>
            </div>
          </button>

          <button className="glass-effect rounded-xl p-4 text-left hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <p className="text-white font-medium">Verify Payments</p>
                <p className="text-white/60 text-sm">Review transactions</p>
              </div>
            </div>
          </button>

          <button className="glass-effect rounded-xl p-4 text-left hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Filter className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="text-white font-medium">Generate Reports</p>
                <p className="text-white/60 text-sm">Export data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
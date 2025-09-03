import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StudentLogin from './pages/StudentLogin'
import EmployeeLogin from './pages/EmployeeLogin'
import StudentDashboard from './pages/StudentDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
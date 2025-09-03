import axios from 'axios'

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: window.location.origin,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('currentUser')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// API service functions
export const studentAPI = {
  login: (rollNumber: string, password: string) =>
    api.post('/api/student/auth', { rollNumber, password }),
  
  getPaymentDetails: (rollNumber: string) =>
    api.get(`/api/student/payment-details/${rollNumber}`),
  
  submitTransaction: (transactionData: any) =>
    api.post('/api/student/submit-transaction', transactionData),
  
  getTransactions: (rollNumber: string) =>
    api.get(`/api/student/transactions/${rollNumber}`),
  
  getComplaints: (rollNumber: string) =>
    api.get(`/api/student/complaints/${rollNumber}`),
  
  submitComplaint: (complaintData: any) =>
    api.post('/api/student/complaint', complaintData),
}

export const employeeAPI = {
  login: (email: string, password: string) =>
    api.post('/api/employee/auth', { email, password }),
  
  getStudents: () =>
    api.get('/api/students/list'),
  
  filterStudents: (filters: any) =>
    api.post('/api/students/filter', filters),
  
  addStudent: (studentData: any) =>
    api.post('/api/students', studentData),
  
  verifyTransaction: (transactionData: any) =>
    api.post('/api/verify-transaction', transactionData),
  
  getSession: () =>
    api.get('/api/employee/session'),
}
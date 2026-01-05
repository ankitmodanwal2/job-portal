import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import CreateJob from './pages/CreateJob'
import MyApplications from './pages/MyApplications'
import MyJobs from './pages/MyJobs'
import JobApplications from './pages/JobApplications'

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />

                        <Route
                            path="/create-job"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYER">
                                    <CreateJob />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-jobs"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYER">
                                    <MyJobs />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-applications"
                            element={
                                <ProtectedRoute requiredRole="JOBSEEKER">
                                    <MyApplications />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/jobs/:id/applications"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYER">
                                    <JobApplications />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
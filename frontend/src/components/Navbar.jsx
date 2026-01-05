import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully')
        navigate('/login')
        setMobileMenuOpen(false)
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Briefcase className="h-8 w-8 text-primary-600" />
                            <span className="text-2xl font-bold text-gray-900">JobPortal</span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex ml-10 space-x-4">
                                <Link
                                    to="/jobs"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Browse Jobs
                                </Link>

                                {user.role === 'EMPLOYER' && (
                                    <>
                                        <Link
                                            to="/create-job"
                                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Post Job
                                        </Link>
                                        <Link
                                            to="/my-jobs"
                                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            My Jobs
                                        </Link>
                                    </>
                                )}

                                {user.role === 'JOBSEEKER' && (
                                    <Link
                                        to="/my-applications"
                                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        My Applications
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <User className="h-5 w-5" />
                                    <span className="hidden lg:inline">{user.email}</span>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {user.role}
                  </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 hover:text-primary-600"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <User className="h-5 w-5" />
                                        <span>{user.email}</span>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {user.role}
                  </span>
                                </div>

                                <Link
                                    to="/jobs"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                >
                                    Browse Jobs
                                </Link>

                                {user.role === 'EMPLOYER' && (
                                    <>
                                        <Link
                                            to="/create-job"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                        >
                                            Post Job
                                        </Link>
                                        <Link
                                            to="/my-jobs"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                        >
                                            My Jobs
                                        </Link>
                                    </>
                                )}

                                {user.role === 'JOBSEEKER' && (
                                    <Link
                                        to="/my-applications"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    >
                                        My Applications
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
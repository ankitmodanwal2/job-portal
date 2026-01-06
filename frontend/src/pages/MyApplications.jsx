import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const MyApplications = () => {
    const { user } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const response = await api.get(`/app/user/${user.userId}`)
            if (response.data.status) {
                setApplications(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to fetch applications')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            APPLIED: 'bg-blue-100 text-blue-800 border-blue-200',
            SHORTLISTED: 'bg-green-100 text-green-800 border-green-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200'
        }
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const getStatusIcon = (status) => {
        const icons = {
            APPLIED: <Clock className="h-5 w-5" />,
            SHORTLISTED: <CheckCircle className="h-5 w-5" />,
            REJECTED: <XCircle className="h-5 w-5" />
        }
        return icons[status] || <AlertCircle className="h-5 w-5" />
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getJobTypeColor = (type) => {
        const colors = {
            FULL_TIME: 'bg-green-100 text-green-800',
            PART_TIME: 'bg-blue-100 text-blue-800',
            INTERN: 'bg-purple-100 text-purple-800'
        }
        return colors[type] || 'bg-gray-100 text-gray-800'
    }

    const formatJobType = (type) => {
        return type?.replace('_', ' ') || 'N/A'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
                    <p className="text-gray-600">Track your job applications ({applications.length} total)</p>
                </div>

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center space-x-2 btn-primary"
                        >
                            <Briefcase className="h-5 w-5" />
                            <span>Browse Jobs</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((application) => (
                            <div
                                key={application.job.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <Link
                                                    to={`/jobs/${application.job.id}`}
                                                    className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                                                >
                                                    {application.job.title}
                                                </Link>
                                                <p className="text-lg text-gray-600 font-medium mt-1">
                                                    {application.job.companyName}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeColor(application.job.jobType)}`}>
                        {formatJobType(application.job.jobType)}
                      </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-5 w-5 mr-2" />
                                                <span>{application.job.location}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-5 w-5 mr-2" />
                                                <span>{application.job.salary}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(application.status)}`}>
                                                {getStatusIcon(application.status)}
                                                <span className="font-semibold">{application.status}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>Applied on {formatDate(application.appliedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <Link
                                        to={`/jobs/${application.job.id}`}
                                        className="text-primary-600 hover:text-primary-700 font-semibold"
                                    >
                                        View Job Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyApplications
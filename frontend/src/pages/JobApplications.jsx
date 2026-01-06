import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ArrowLeft, User, Mail, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

const JobApplications = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    })

    useEffect(() => {
        fetchJobDetails()
        fetchApplications()
    }, [id, pagination.page])

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${id}`)
            if (response.data.status) {
                setJob(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to fetch job details')
        }
    }

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/app/job/${id}`, {
                params: {
                    page: pagination.page,
                    size: pagination.size,
                    sortBy: 'appliedAt',
                    direction: 'desc'
                }
            })

            if (response.data.status) {
                setApplications(response.data.data.content)
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.data.totalPages,
                    totalElements: response.data.data.totalElements
                }))
            }
        } catch (error) {
            toast.error('Failed to fetch applications')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            const response = await api.put(`/app/status/${applicationId}`, newStatus, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.data.status) {
                toast.success('Application status updated')
                fetchApplications()
            }
        } catch (error) {
            toast.error('Failed to update status')
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading && !applications.length) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/my-jobs')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to My Jobs</span>
                </button>

                {/* Header */}
                {job && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <p className="text-gray-600 text-lg">{job.companyName}</p>
                        <div className="mt-4 flex items-center text-gray-500">
                            <User className="h-5 w-5 mr-2" />
                            <span>{pagination.totalElements} total applications</span>
                        </div>
                    </div>
                )}

                {/* Applications */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600">Applications will appear here once candidates apply</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 mb-8">
                            {applications.map((application) => (
                                <div
                                    key={application.user.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="bg-primary-100 p-3 rounded-full">
                                                    <User className="h-6 w-6 text-primary-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {application.user.name}
                                                    </h3>
                                                    <div className="flex items-center text-gray-600 mt-1">
                                                        <Mail className="h-4 w-4 mr-1" />
                                                        <span className="text-sm">{application.user.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>Applied on {formatDate(application.appliedAt)}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(application.status)}`}>
                                                    {application.status === 'APPLIED' && <Clock className="h-5 w-5" />}
                                                    {application.status === 'SHORTLISTED' && <CheckCircle className="h-5 w-5" />}
                                                    {application.status === 'REJECTED' && <XCircle className="h-5 w-5" />}
                                                    <span className="font-semibold">{application.status}</span>
                                                </div>

                                                {application.status === 'APPLIED' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(application.job.id, 'SHORTLISTED')}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>Shortlist</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(application.job.id, 'REJECTED')}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}

                                                {application.status === 'SHORTLISTED' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(application.job.id, 'APPLIED')}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                                                        >
                                                            <Clock className="h-4 w-4" />
                                                            <span>Move to Applied</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(application.job.id, 'REJECTED')}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}

                                                {application.status === 'REJECTED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(application.job.id, 'APPLIED')}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                                                    >
                                                        <Clock className="h-4 w-4" />
                                                        <span>Move to Applied</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-4">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 0}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    <span>Previous</span>
                                </button>

                                <span className="text-gray-600">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>

                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page >= pagination.totalPages - 1}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default JobApplications
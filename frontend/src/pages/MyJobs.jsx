import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Trash2, Eye, PlusCircle, Users } from 'lucide-react'

const MyJobs = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMyJobs()
    }, [])

    const fetchMyJobs = async () => {
        try {
            const response = await api.get('/jobs')
            if (response.data.status) {
                setJobs(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to fetch jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return
        }

        try {
            const response = await api.delete(`/jobs/${jobId}`)
            if (response.data.status) {
                toast.success('Job deleted successfully')
                setJobs(jobs.filter(job => job.id !== jobId))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete job')
        }
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Job Posts</h1>
                        <p className="text-gray-600">Manage your job listings ({jobs.length} active)</p>
                    </div>
                    <Link
                        to="/create-job"
                        className="flex items-center space-x-2 btn-primary"
                    >
                        <PlusCircle className="h-5 w-5" />
                        <span>Post New Job</span>
                    </Link>
                </div>

                {/* Jobs List */}
                {jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                        <p className="text-gray-600 mb-6">Start by creating your first job listing</p>
                        <Link
                            to="/create-job"
                            className="inline-flex items-center space-x-2 btn-primary"
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span>Post a Job</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {job.title}
                                                </h3>
                                                <p className="text-lg text-gray-600 font-medium">{job.companyName}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeColor(job.jobType)}`}>
                        {formatJobType(job.jobType)}
                      </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-5 w-5 mr-2" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-5 w-5 mr-2" />
                                                <span>{job.salary}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 line-clamp-2 mb-4">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                to={`/jobs/${job.id}/applications`}
                                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                            >
                                                <Users className="h-4 w-4" />
                                                <span>View Applications</span>
                                            </Link>
                                            <Link
                                                to={`/jobs/${job.id}`}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>View Details</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyJobs
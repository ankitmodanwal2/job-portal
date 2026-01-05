import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { MapPin, DollarSign, Briefcase, Building2, ArrowLeft, Send } from 'lucide-react'

const JobDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)

    useEffect(() => {
        fetchJobDetails()
    }, [id])

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${id}`)
            if (response.data.status) {
                setJob(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to fetch job details')
            navigate('/jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleApply = async () => {
        if (user?.role !== 'JOBSEEKER') {
            toast.error('Only job seekers can apply to jobs')
            return
        }

        setApplying(true)
        try {
            const response = await api.post('/app', { jobId: parseInt(id) })
            if (response.data.status) {
                toast.success('Application submitted successfully!')
            }
        } catch (error) {
            if (error.response?.data?.message?.includes('already applied')) {
                toast.error('You have already applied to this job')
            } else {
                toast.error(error.response?.data?.message || 'Failed to apply')
            }
        } finally {
            setApplying(false)
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

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
                    <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
                        Back to Jobs
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/jobs')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Jobs</span>
                </button>

                {/* Job Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                {job.title}
                            </h1>
                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <Building2 className="h-5 w-5 mr-2" />
                                    <span className="font-semibold">{job.companyName}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getJobTypeColor(job.jobType)}`}>
                {formatJobType(job.jobType)}
              </span>
                        </div>

                        {user?.role === 'JOBSEEKER' && (
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {applying ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        <span>Apply Now</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Salary */}
                    <div className="bg-primary-50 rounded-lg p-4 inline-flex items-center">
                        <DollarSign className="h-6 w-6 text-primary-600 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">Salary</p>
                            <p className="text-lg font-bold text-gray-900">{job.salary}</p>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {job.description}
                        </p>
                    </div>

                    {user?.role === 'JOBSEEKER' && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full flex items-center justify-center space-x-2 btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {applying ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Send className="h-6 w-6" />
                                        <span>Apply for this Position</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobDetail
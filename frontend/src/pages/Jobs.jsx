import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Search, MapPin, Briefcase, DollarSign, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

const Jobs = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        location: ''
    })
    const [pagination, setPagination] = useState({
        page: 0,
        size: 9,
        totalPages: 0,
        totalElements: 0
    })

    useEffect(() => {
        fetchJobs()
    }, [pagination.page])

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = {
                page: pagination.page,
                size: pagination.size,
                sortBy: 'createdAt',
                direction: 'desc'
            }

            if (searchParams.keyword) params.keyword = searchParams.keyword
            if (searchParams.location) params.location = searchParams.location

            const response = await api.get('/jobs/search', { params })

            if (response.data.status) {
                setJobs(response.data.data.content)
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.data.totalPages,
                    totalElements: response.data.data.totalElements
                }))
            }
        } catch (error) {
            toast.error('Failed to fetch jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPagination(prev => ({ ...prev, page: 0 }))
        fetchJobs()
    }

    const handleInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
                    <p className="text-gray-600">Find your next opportunity from {pagination.totalElements} available positions</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="keyword"
                                value={searchParams.keyword}
                                onChange={handleInputChange}
                                placeholder="Job title or keyword..."
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="location"
                                value={searchParams.location}
                                onChange={handleInputChange}
                                placeholder="Location..."
                                className="input-field pl-10"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary flex items-center justify-center space-x-2"
                        >
                            <Search className="h-5 w-5" />
                            <span>Search Jobs</span>
                        </button>
                    </div>
                </form>

                {/* Jobs Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {jobs.map((job) => (
                                <Link
                                    key={job.id}
                                    to={`/jobs/${job.id}`}
                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                                {job.title}
                                            </h3>
                                            <p className="text-gray-600 font-medium mb-2">{job.companyName}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeColor(job.jobType)}`}>
                      {formatJobType(job.jobType)}
                    </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            {job.salary}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {job.description}
                                    </p>

                                    <div className="pt-4 border-t border-gray-100">
                    <span className="text-primary-600 font-semibold text-sm hover:text-primary-700">
                      View Details →
                    </span>
                                    </div>
                                </Link>
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

export default Jobs
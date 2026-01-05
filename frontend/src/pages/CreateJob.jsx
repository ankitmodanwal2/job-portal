import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Briefcase, Building2, MapPin, DollarSign, FileText, PlusCircle } from 'lucide-react'

const CreateJob = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        companyName: '',
        salary: '',
        jobType: 'FULL_TIME'
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post('/jobs', formData)
            if (response.data.status) {
                toast.success('Job posted successfully!')
                navigate('/my-jobs')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create job')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-primary-600 p-3 rounded-full">
                            <PlusCircle className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                            <p className="text-gray-600">Fill in the details to create a job listing</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                    placeholder="e.g. Tech Corp Inc."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="input-field pl-10"
                                        placeholder="e.g. New York, USA"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salary *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        required
                                        className="input-field pl-10"
                                        placeholder="e.g. $80,000 - $120,000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Type *
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.jobType === 'FULL_TIME'
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value="FULL_TIME"
                                        checked={formData.jobType === 'FULL_TIME'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className={`font-medium ${
                                        formData.jobType === 'FULL_TIME' ? 'text-primary-600' : 'text-gray-700'
                                    }`}>
                    Full Time
                  </span>
                                </label>

                                <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.jobType === 'PART_TIME'
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value="PART_TIME"
                                        checked={formData.jobType === 'PART_TIME'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className={`font-medium ${
                                        formData.jobType === 'PART_TIME' ? 'text-primary-600' : 'text-gray-700'
                                    }`}>
                    Part Time
                  </span>
                                </label>

                                <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.jobType === 'INTERN'
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value="INTERN"
                                        checked={formData.jobType === 'INTERN'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className={`font-medium ${
                                        formData.jobType === 'INTERN' ? 'text-primary-600' : 'text-gray-700'
                                    }`}>
                    Intern
                  </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={8}
                                    className="input-field pl-10 resize-none"
                                    placeholder="Describe the job responsibilities, requirements, and qualifications..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <PlusCircle className="h-5 w-5" />
                                        <span>Post Job</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/my-jobs')}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateJob
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, Search, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

const Home = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Find Your Dream Job Today
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Connect with top employers and discover opportunities that match your skills
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Link
                                    to="/jobs"
                                    className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                >
                                    <Search className="h-6 w-6" />
                                    <span>Browse Jobs</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center space-x-2 bg-primary-700 hover:bg-primary-800 border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                    >
                                        <span>Sign In</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose JobPortal?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to accelerate your career
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Briefcase className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Quality Jobs
                            </h3>
                            <p className="text-gray-600">
                                Access thousands of verified job listings from top companies across various industries.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Search className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Smart Search
                            </h3>
                            <p className="text-gray-600">
                                Find the perfect job with our advanced search and filtering system.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Career Growth
                            </h3>
                            <p className="text-gray-600">
                                Track your applications and take the next step in your professional journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Your journey to success in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Create Your Profile
                            </h3>
                            <p className="text-gray-600">
                                Sign up and set up your profile in minutes
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Search & Apply
                            </h3>
                            <p className="text-gray-600">
                                Browse jobs and apply with one click
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Get Hired
                            </h3>
                            <p className="text-gray-600">
                                Connect with employers and land your dream job
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="py-20 bg-primary-600">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Join thousands of job seekers and employers today
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                        >
                            <span>Create Free Account</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Home
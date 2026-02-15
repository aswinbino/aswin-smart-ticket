import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaTicketAlt, FaChartBar } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

function Home() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            try {
                const response = await axios.get('http://localhost:5000/api/tickets/stats', config);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-warm-gray to-white relative overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean-blue/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header Section */}
                <section className='text-center mb-16'>
                    <h1 className="text-6xl font-bold mb-6 text-charcoal tracking-tight">
                        IT Support Center
                    </h1>
                    <p className="text-2xl text-slate max-w-2xl mx-auto">
                        Welcome back{user ? `, ${user.name}` : ''}! How can we help you today?
                    </p>
                </section>

                {/* Admin Stats Dashboard */}
                {user && user.role === 'admin' && stats && (
                    <div className="mb-16 max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom-lg p-8 border border-gray-100">
                            <div className="flex items-center justify-center mb-6">
                                <FaChartBar className="text-3xl text-teal-accent mr-3" />
                                <h2 className="text-3xl font-bold text-charcoal">Ticket Statistics</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-success to-success/80 p-6 rounded-xl shadow-custom text-white hover-lift">
                                    <h3 className="text-lg font-semibold mb-2 opacity-90">New</h3>
                                    <p className="text-5xl font-bold">{stats.new}</p>
                                    <p className="text-sm mt-2 opacity-80">Pending review</p>
                                </div>
                                <div className="bg-gradient-to-br from-warning to-warning/80 p-6 rounded-xl shadow-custom text-white hover-lift">
                                    <h3 className="text-lg font-semibold mb-2 opacity-90">Open</h3>
                                    <p className="text-5xl font-bold">{stats.open}</p>
                                    <p className="text-sm mt-2 opacity-80">In progress</p>
                                </div>
                                <div className="bg-gradient-to-br from-neutral to-neutral/80 p-6 rounded-xl shadow-custom text-white hover-lift">
                                    <h3 className="text-lg font-semibold mb-2 opacity-90">Closed</h3>
                                    <p className="text-5xl font-bold">{stats.closed}</p>
                                    <p className="text-sm mt-2 opacity-80">Resolved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Cards */}
                <div className='max-w-4xl mx-auto'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Create Ticket Card */}
                        <Link
                            to='/new-ticket'
                            className='group bg-white/90 backdrop-blur-sm rounded-2xl shadow-custom-lg p-8 border-2 border-transparent hover:border-teal-accent/30 hover-lift transition-all duration-300'
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-teal-accent rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all group-hover:scale-110 duration-300">
                                    <FaQuestionCircle className="text-4xl text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-charcoal mb-3">Create New Ticket</h2>
                                <p className="text-slate">Need help? Submit a new support ticket and our team will assist you shortly.</p>
                            </div>
                        </Link>

                        {/* View Tickets Card */}
                        <Link
                            to='/tickets'
                            className='group bg-white/90 backdrop-blur-sm rounded-2xl shadow-custom-lg p-8 border-2 border-transparent hover:border-teal-accent/30 hover-lift transition-all duration-300'
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-ocean-blue rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all group-hover:scale-110 duration-300">
                                    <FaTicketAlt className="text-4xl text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-charcoal mb-3">View My Tickets</h2>
                                <p className="text-slate">Check the status of your submitted tickets and view responses from our support team.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

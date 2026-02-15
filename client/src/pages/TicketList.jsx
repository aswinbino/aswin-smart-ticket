import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { user } = useAuth();

    const fetchTickets = useCallback(async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            params: {
                search: searchText,
                status: statusFilter
            }
        };

        try {
            const response = await axios.get('http://localhost:5000/api/tickets', config);
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [user, searchText, statusFilter]);

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user, fetchTickets]);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-warm-gray to-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-accent border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate text-lg">Loading tickets...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-warm-gray to-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-charcoal">My Tickets</h1>

                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="px-4 py-3 border border-gray-200 rounded-xl w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all bg-white shadow-custom"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all bg-white shadow-custom"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="bg-white shadow-custom-lg rounded-2xl overflow-hidden border border-gray-100">
                    <ul className="divide-y divide-gray-100">
                        {tickets.map((ticket) => (
                            <li key={ticket._id}>
                                <Link to={`/ticket/${ticket._id}`} className="block hover:bg-teal-accent/5 p-6 transition-all">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-semibold text-charcoal truncate">{ticket.title}</p>
                                        <div className="ml-4 flex-shrink-0">
                                            <span className={`status-badge ${ticket.status === 'new' ? 'bg-success/10 text-success border border-success/20' :
                                                    ticket.status === 'open' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                        'bg-neutral/10 text-neutral border border-neutral/20'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-slate">
                                            {new Date(ticket.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {tickets.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-teal-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-teal-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-xl text-slate font-medium">No tickets found</p>
                        <p className="text-slate mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketList;

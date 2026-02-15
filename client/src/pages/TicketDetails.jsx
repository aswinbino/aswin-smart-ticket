import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

function TicketDetails() {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicket = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            try {
                const response = await axios.get(`http://localhost:5000/api/tickets/${id}`, config);
                setTicket(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load ticket');
                navigate('/tickets');
            }
        };

        if (user) {
            fetchTicket();
        }
    }, [user, id, navigate]);

    const onCloseTicket = async () => {
        if (!window.confirm('Are you sure you want to close this ticket?')) {
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}`, { status: 'closed' }, config);
            setTicket((prev) => ({ ...prev, status: 'closed' }));
            toast.success('✅ Ticket closed successfully');
            setTimeout(() => navigate('/tickets'), 1500);
        } catch (error) {
            console.error(error);
            toast.error('Failed to close ticket');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-warm-gray to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-accent border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate text-lg">Loading ticket details...</p>
                </div>
            </div>
        );
    }

    const statusConfig = {
        new: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', icon: FaClock, label: 'New' },
        open: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', icon: FaClock, label: 'In Progress' },
        closed: { bg: 'bg-neutral/10', text: 'text-neutral', border: 'border-neutral/20', icon: FaCheckCircle, label: 'Closed' }
    };

    const currentStatus = statusConfig[ticket.status] || statusConfig.new;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen bg-gradient-to-b from-warm-gray to-white py-12">
            <button
                onClick={() => navigate('/tickets')}
                className="container mx-auto px-4 max-w-4xl mb-6 text-teal-accent hover:text-teal-accent/80 font-semibold flex items-center gap-2 transition"
            >
                ← Back to Tickets
            </button>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-custom-lg overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-accent to-ocean-blue p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <FaTicketAlt className="text-3xl text-white" />
                                    <h1 className="text-3xl font-bold text-white">Ticket Details</h1>
                                </div>
                                <p className="text-white/80 text-sm">ID: {ticket._id}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl ${currentStatus.bg} ${currentStatus.text} border ${currentStatus.border} flex items-center gap-2 font-semibold bg-white/20 backdrop-blur-sm`}>
                                <StatusIcon />
                                {currentStatus.label}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Meta Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                            <div>
                                <p className="text-sm text-slate mb-1">Submitted</p>
                                <p className="text-charcoal font-semibold">{new Date(ticket.createdAt).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate mb-1">Last Updated</p>
                                <p className="text-charcoal font-semibold">{new Date(ticket.updatedAt || ticket.createdAt).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h3 className="text-sm font-bold text-slate mb-2">Issue Title</h3>
                            <h2 className="text-2xl font-bold text-charcoal">{ticket.title}</h2>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-bold text-slate mb-3">Description</h3>
                            <div className="bg-warm-gray p-6 rounded-xl border border-gray-200">
                                <p className="text-charcoal whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        {ticket.status !== 'closed' && (
                            <div className="pt-6">
                                <button
                                    onClick={onCloseTicket}
                                    className="w-full md:w-auto bg-error hover:bg-error/90 text-white px-8 py-3 rounded-xl font-bold transition transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <FaCheckCircle />
                                    Mark as Closed
                                </button>
                            </div>
                        )}

                        {ticket.status === 'closed' && (
                            <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                                <FaCheckCircle className="text-success text-2xl" />
                                <div>
                                    <p className="text-success font-bold">This ticket has been closed</p>
                                    <p className="text-sm text-slate">Thank you for using our support system</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketDetails;

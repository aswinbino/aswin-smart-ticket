import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaExclamationCircle, FaTags } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

function TicketForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'other'
    });
    const [submitting, setSubmitting] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const { title, description, priority, category } = formData;
    const maxChars = 500;
    const charsRemaining = maxChars - description.length;

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-slate-600' },
        { value: 'medium', label: 'Medium', color: 'text-warning' },
        { value: 'high', label: 'High', color: 'text-error' },
        { value: 'urgent', label: 'Urgent', color: 'text-error font-bold' }
    ];

    const categories = [
        { value: 'hardware', label: '🖥️ Hardware' },
        { value: 'software', label: '💻 Software' },
        { value: 'network', label: '🌐 Network' },
        { value: 'account', label: '👤 Account Access' },
        { value: 'other', label: '📌 Other' }
    ];

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        try {
            await axios.post('http://localhost:5000/api/tickets', formData, config);
            toast.success('🎉 Ticket created successfully!');
            navigate('/tickets');
        } catch (error) {
            console.error(error);
            toast.error('❌ Failed to create ticket. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-warm-gray to-white py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <section className='text-center mb-12'>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-accent rounded-2xl mb-4">
                        <FaTicketAlt className="text-3xl text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-charcoal mb-3">Create New Ticket</h1>
                    <p className="text-slate text-lg">Describe your issue and we'll get back to you shortly</p>
                </section>

                {/* Form */}
                <section className='bg-white rounded-2xl shadow-custom-lg p-8 border border-gray-100'>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor='title' className="block text-charcoal text-sm font-bold mb-2">
                                Issue Title *
                            </label>
                            <input
                                type='text'
                                className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all'
                                id='title'
                                name='title'
                                value={title}
                                onChange={onChange}
                                placeholder="Brief summary of your issue"
                                required
                            />
                        </div>

                        {/* Priority and Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Priority */}
                            <div>
                                <label htmlFor='priority' className="block text-charcoal text-sm font-bold mb-2 flex items-center gap-2">
                                    <FaExclamationCircle className="text-warning" />
                                    Priority
                                </label>
                                <select
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all bg-white'
                                    id='priority'
                                    name='priority'
                                    value={priority}
                                    onChange={onChange}
                                >
                                    {priorities.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor='category' className="block text-charcoal text-sm font-bold mb-2 flex items-center gap-2">
                                    <FaTags className="text-teal-accent" />
                                    Category
                                </label>
                                <select
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all bg-white'
                                    id='category'
                                    name='category'
                                    value={category}
                                    onChange={onChange}
                                >
                                    {categories.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor='description' className="block text-charcoal text-sm font-bold">
                                    Detailed Description *
                                </label>
                                <span className={`text-sm ${charsRemaining < 50 ? 'text-error font-semibold' : 'text-slate'}`}>
                                    {charsRemaining} characters remaining
                                </span>
                            </div>
                            <textarea
                                className='w-full px-4 py-3 border border-gray-200 rounded-xl h-40 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all resize-none'
                                id='description'
                                name='description'
                                value={description}
                                onChange={onChange}
                                maxLength={maxChars}
                                placeholder="Please provide as much detail as possible about the issue you're experiencing..."
                                required
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className='w-full bg-teal-accent hover:bg-teal-accent/90 disabled:bg-slate disabled:cursor-not-allowed text-white p-4 rounded-xl font-bold text-lg transition transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Creating Ticket...
                                </>
                            ) : (
                                <>
                                    <FaTicketAlt />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default TicketForm;

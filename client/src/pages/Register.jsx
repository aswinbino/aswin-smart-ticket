import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData;

    const navigate = useNavigate();
    const { register, user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await register({ name, email, password });
            toast.success('Registration successful!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center mesh-gradient dot-pattern px-4 py-12 overflow-hidden" style={{ background: 'linear-gradient(225deg, var(--deep-navy) 0%, var(--ocean-blue) 50%, #0D4B5E 100%)' }}>
            {/* Decorative background elements - mirrored from login */}
            <div className="deco-circle deco-circle-sm top-[10%] right-[-5%]"></div>
            <div className="deco-circle deco-circle-lg bottom-[-10%] left-[-10%]"></div>

            <div className="relative w-full max-w-md z-10">
                {/* Glass card with texture */}
                <div className="glass-card rounded-3xl shadow-2xl p-8 relative texture-overlay">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-accent/20 rounded-2xl mb-4 backdrop-blur-sm border border-teal-accent/30">
                            <FaUserPlus className="text-4xl text-mint" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
                        <p className="text-slate-300 text-lg">Join our support system</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    value={password2}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-teal-accent hover:bg-teal-accent/90 text-white rounded-xl font-bold text-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-300">
                            Already have an account?{' '}
                            <Link to="/login" className="text-mint font-semibold hover:underline transition-all">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm">
                        By registering, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;

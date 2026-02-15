import { useState, useEffect } from 'react';
import { FaUserShield, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

function AdminRegister() {
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
            // Pass role='admin' to create admin user
            await register({ name, email, password, role: 'admin' });
            toast.success('Admin account created successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center mesh-gradient dot-pattern px-4 py-12 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--deep-navy) 0%, var(--ocean-blue) 50%, #0A1929 100%)' }}>
            {/* Decorative background elements */}
            <div className="deco-circle deco-circle-lg top-[-15%] right-[-10%]"></div>
            <div className="deco-circle deco-circle-sm bottom-[15%] left-[-5%]"></div>

            <div className="relative w-full max-w-md z-10">
                {/* Glass card with texture */}
                <div className="glass-card rounded-3xl shadow-2xl p-8 relative texture-overlay border-2 border-warning/20">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-warning/20 rounded-2xl mb-4 backdrop-blur-sm border-2 border-warning/40 shadow-lg">
                            <FaShieldAlt className="text-5xl text-warning" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Admin Registration</h1>
                        <p className="text-slate-300 text-lg">Createadministrative Account</p>
                        <div className="mt-4 inline-block px-4 py-2 bg-warning/10 border border-warning/30 rounded-full">
                            <p className="text-warning text-sm flex items-center gap-2 font-semibold">
                                <FaShieldAlt />
                                Elevated Privileges
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="name">
                                Administrator Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUserShield className="text-warning" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    placeholder="Admin Name"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-warning/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-warning" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-warning/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-warning" />
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
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-warning/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-warning" />
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
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-warning/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-warning hover:bg-warning/90 text-white rounded-xl font-bold text-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl mt-6 flex items-center justify-center gap-2"
                        >
                            <FaShieldAlt />
                            Create Admin Account
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 space-y-3">
                        <div className="text-center">
                            <p className="text-slate-300">
                                Already have an account?{' '}
                                <Link to="/login" className="text-warning font-semibold hover:underline transition-all">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                        <div className="text-center pt-3 border-t border-white/10">
                            <p className="text-slate-400 text-sm mb-2">Not an admin?</p>
                            <Link
                                to="/register"
                                className="inline-block px-4 py-2 bg-teal-accent/20 hover:bg-teal-accent/30 text-teal-accent rounded-lg text-sm font-semibold transition-all border border-teal-accent/30"
                            >
                                Create User Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                        <FaShieldAlt className="text-warning" />
                        Secure registration with administrative permissions
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;

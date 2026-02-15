import { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSignInAlt, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const { login, user } = useAuth();

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

        try {
            await login(formData);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center mesh-gradient dot-pattern px-4 py-12 overflow-hidden">
            {/* Decorative background elements */}
            <div className="deco-circle deco-circle-lg top-[-10%] left-[-10%]"></div>
            <div className="deco-circle deco-circle-sm bottom-[10%] right-[5%]"></div>

            <div className="relative w-full max-w-md z-10">
                {/* Glass card with texture */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-accent rounded-2xl mb-4 shadow-lg">
                            <FaSignInAlt className="text-4xl text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-charcoal mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate text-lg">IT Ticket Support System</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-charcoal text-sm font-semibold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-teal-accent" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-charcoal placeholder-slate focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-charcoal text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-teal-accent" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-charcoal placeholder-slate focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-teal-accent hover:bg-teal-accent/90 text-white rounded-xl font-bold text-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Register Links */}
                    <div className="mt-6 space-y-3">
                        <div className="text-center">
                            <p className="text-slate">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-teal-accent font-semibold hover:underline transition-all">
                                    Register as User
                                </Link>
                            </p>
                        </div>
                        <div className="text-center pt-3 border-t border-gray-200">
                            <p className="text-slate text-sm mb-2">Administrator?</p>
                            <Link
                                to="/admin-register"
                                className="inline-block px-4 py-2 bg-warning/20 hover:bg-warning/30 text-warning rounded-lg text-sm font-semibold transition-all border border-warning/30"
                            >
                                Create Admin Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-white text-sm">
                        Secure login • Protected by encryption
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;

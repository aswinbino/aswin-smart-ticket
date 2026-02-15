import { FaSignInAlt, FaSignOutAlt, FaUser, FaTicketAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const onLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <header className='backdrop-blur-md bg-white/90 shadow-sm sticky top-0 z-50 border-b border-gray-100'>
            <div className="container mx-auto px-6 py-4">
                <div className='flex justify-between items-center'>
                    <div className='logo'>
                        <Link to='/' className="flex items-center text-2xl font-bold text-teal-accent hover:text-teal-accent/80 transition-all">
                            <FaTicketAlt className="mr-2" />
                            IT Support
                        </Link>
                    </div>
                    <ul className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <li className="text-gray-700 font-medium">
                                    Welcome, <span className="font-bold text-teal-accent">{user.name}</span>
                                    {user.role === 'admin' && (
                                        <span className="ml-2 px-2 py-1 bg-teal-accent/10 text-teal-accent text-xs font-semibold rounded-full border border-teal-accent/20">Admin</span>
                                    )}
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className='flex items-center bg-white border-2 border-error text-error hover:bg-error hover:text-white px-5 py-2 rounded-lg font-bold transition-all transform hover:scale-105 shadow-sm hover:shadow-md'
                                        onClick={onLogout}
                                    >
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </li>
                            </>

                        ) : (
                            <>
                                <li>
                                    <Link to='/login' className="flex items-center text-gray-700 hover:text-teal-accent font-semibold transition-all">
                                        <FaSignInAlt className="mr-2" /> Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/register' className="flex items-center bg-teal-accent hover:bg-teal-accent/90 text-white px-5 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md">
                                        <FaUser className="mr-2" /> Register
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/admin-register' className="flex items-center bg-warning hover:bg-warning/90 text-white px-5 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md">
                                        👤 Admin Signup
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header

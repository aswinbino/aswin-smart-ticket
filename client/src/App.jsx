import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import TicketList from './pages/TicketList';
import TicketForm from './pages/TicketForm';
import TicketDetails from './pages/TicketDetails';
import useAuth from './hooks/useAuth';

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && !window.location.pathname.includes('/admin-register') && <Header />}
            <Routes>
                <Route path='/' element={user ? <Home /> : <Navigate to="/login" replace />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to="/" replace />} />
                <Route path='/register' element={!user ? <Register /> : <Navigate to="/" replace />} />
                <Route path='/admin-register' element={!user ? <AdminRegister /> : <Navigate to="/" replace />} />
                <Route path='/tickets' element={<PrivateRoute />}>
                    <Route path='/tickets' element={<TicketList />} />
                </Route>
                <Route path='/new-ticket' element={<PrivateRoute />}>
                    <Route path='/new-ticket' element={<TicketForm />} />
                </Route>
                <Route path='/ticket/:id' element={<PrivateRoute />}>
                    <Route path='/ticket/:id' element={<TicketDetails />} />
                </Route>
            </Routes>
        </>
    );
}

function App() {
    return (
        <>
            <Router>
                <AuthProvider>
                    <div className='min-h-screen'>
                        <AppRoutes />
                    </div>
                </AuthProvider>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;

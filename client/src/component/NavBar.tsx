import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const location = useLocation();
    
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">HowMuch</Link>
            </div>
            <div className="navbar-links">
                <Link 
                    to="/" 
                    className={location.pathname === '/' ? 'active' : ''}
                >
                    Home
                </Link>
                <Link 
                    to="/users" 
                    className={location.pathname === '/users' ? 'active' : ''}
                >
                    Users
                </Link>
                <Link 
                    to="/schedules" 
                    className={location.pathname === '/schedules' ? 'active' : ''}
                >
                    Schedules
                </Link>
            </div>
            <div className="navbar-auth">
                <Link 
                    to="/login" 
                    className={`auth-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                    Login
                </Link>
                <Link 
                    to="/register" 
                    className={`auth-link register ${location.pathname === '/register' ? 'active' : ''}`}
                >
                    Register
                </Link>
            </div>
        </nav>
    );
}

export default NavBar;
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="w-1/3"></div>
      
      <div className="w-1/3 flex justify-center items-center gap-4">
        <a href="/" className="text-xl font-semibold hover:text-gray-600 transition-colors">clipcodeAI</a>
        <span className="text-gray-300">|</span>
        {user ? (
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="border border-gray-300 rounded px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-600">Dashboard</a>
            <a href="/account" className="border border-gray-300 rounded px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-600">Account</a>
            <button 
              onClick={handleLogout}
              className="border border-gray-300 rounded px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <a href="/login" className="border border-gray-300 rounded px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-600">Log in</a>
            <a href="/signup" className="border border-gray-300 rounded px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-600">Sign Up</a>
          </div>
        )}
      </div>
      
      <div className="w-1/3"></div>
    </nav>
  );
};

export default Navbar; 
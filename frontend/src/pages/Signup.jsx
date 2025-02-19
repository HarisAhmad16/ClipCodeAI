import { useState } from 'react';
import Navbar from '../components/Navbar';
import { apiClient } from '../api/client'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await apiClient.post('/users/', {  
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.detail || 'Failed to create account. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements (same as Landing page) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(120deg, #f0f4ff 0%, #f5f3ff 100%)`,
          backgroundSize: '100% 100%',
          opacity: 0.8,
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(176, 196, 222, 0.1) 95%),
                           linear-gradient(0deg, transparent 95%, rgba(176, 196, 222, 0.1) 95%)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-black">Join </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500">
                ClipCodeAI
              </span>
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800">
                Log in
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Signup; 
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaUser, FaLock } from 'react-icons/fa';
import { apiClient } from '../api/client';
import useNotification from '../hooks/useNotification';
import Notification from '../components/Notification';

const Account = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { notification, showNotification, hideNotification } = useNotification();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification({
        message: 'New passwords do not match',
        type: 'ERROR'
      });
      return;
    }

    try {
      await apiClient.patch(`/users/${user.id}/password`, {
        currentPassword,
        newPassword
      });
      
      showNotification({
        message: 'Password updated successfully',
        type: 'SUCCESS'
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showNotification({
        message: error.detail || 'Failed to update password',
        type: 'ERROR'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {notification && (
        <Notification
          {...notification}
          onClose={hideNotification}
        />
      )}
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-4 border-b">
          <TabButton 
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<FaUser />}
            text="Profile"
          />
          <TabButton 
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            icon={<FaLock />}
            text="Security"
          />
        </div>

        <div className="py-6">
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Name</label>
                  <p className="text-gray-600">{user.name}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Email</label>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors duration-200
      ${active 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-600 hover:text-blue-600'}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default Account;
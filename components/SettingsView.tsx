import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { Save, Bell, Lock, User as UserIcon } from 'lucide-react';
import { COUNTRIES } from '../constants';

interface Props {
  user: User;
  onUpdateUser: (u: User) => void;
}

const SettingsView: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    country: user.country,
    city: user.city,
    about: user.about || '',
  });

  const [notificationEmail, setNotificationEmail] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const updatedUser = { ...user, ...formData };
    await api.users.update(updatedUser);
    onUpdateUser(updatedUser);
    setLoading(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMsg}
        </div>
      )}

      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-3">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        </div>
        
        <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea 
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={formData.about}
                    onChange={e => setFormData({...formData, about: e.target.value})}
                />
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                    <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationEmail} onChange={() => setNotificationEmail(!notificationEmail)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
      </div>

      {/* Password Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-75">
        <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </div>
        <button className="text-blue-600 text-sm font-medium hover:underline">Change Password</button>
      </div>

    </div>
  );
};

export default SettingsView;
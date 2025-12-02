import React from 'react';
import { User } from '../types';
import { MapPin, Mail, Award, Calendar } from 'lucide-react';

const ProfileView: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                    <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                        {user.name.charAt(0)}
                    </div>
                </div>
                {user.role === 'Premium' && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 flex items-center">
                        <Award className="w-3 h-3 mr-1" /> Premium Member
                    </span>
                )}
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.stakeholderType} • {user.subtype}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{user.city}, {user.country}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${user.email}`} className="hover:text-blue-600">{user.email}</a>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.focusAreas.map(area => (
                            <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {user.about && (
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700">{user.about}</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfileView;

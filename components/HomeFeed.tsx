import React, { useState } from 'react';
import { api } from '../services/mockStore';
import { User, Project, Insight } from '../types';
import { MessageSquare, Share2, Users, MapPin } from 'lucide-react';

interface HomeFeedProps {
  user: User;
  onViewProject: () => void; // Simple navigation helper
}

const HomeFeed: React.FC<HomeFeedProps> = ({ user, onViewProject }) => {
  const [projects] = useState<Project[]>(api.projects.getAll().filter(p => p.status === 'Shared'));
  const [insights] = useState<Insight[]>(api.insights.getAll().filter(i => i.status === 'Shared'));

  // Merge and sort by creation date (mock logic)
  const feedItems = [
    ...projects.map(p => ({ type: 'project', data: p, date: p.createdAt })),
    ...insights.map(i => ({ type: 'insight', data: i, date: i.createdAt }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getUserName = (id: string) => {
    const u = api.users.getById(id);
    return u ? `${u.name} (${u.stakeholderType})` : 'Unknown User';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Your Feed</h2>
            <div className="text-sm text-gray-500">Latest Updates</div>
        </div>

        {feedItems.map((item, idx) => {
          if (item.type === 'project') {
            const p = item.data as Project;
            return (
              <div key={`p-${p.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">Project</span>
                    <span className="text-sm text-gray-500">by {getUserName(p.ownerId)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600" onClick={onViewProject}>
                  {p.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {p.country}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{p.thematicArea}</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{p.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                      <MessageSquare className="w-4 h-4 mr-1.5" /> {p.commentCount} Comments
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                      <Share2 className="w-4 h-4 mr-1.5" /> Share
                    </button>
                  </div>
                  <button onClick={onViewProject} className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Users className="w-4 h-4 mr-1.5" /> View Project
                  </button>
                </div>
              </div>
            );
          } else {
            const i = item.data as Insight;
            return (
              <div key={`i-${i.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase tracking-wide">Insight</span>
                    <span className="text-sm text-gray-500">by {getUserName(i.authorId)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{i.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-4">{i.description}</p>
                <div className="flex items-center pt-4 border-t border-gray-50 space-x-4">
                  <button className="flex items-center text-gray-500 hover:text-amber-600 text-sm">
                    <MessageSquare className="w-4 h-4 mr-1.5" /> Comment
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-amber-600 text-sm">
                    <Share2 className="w-4 h-4 mr-1.5" /> Share
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-3">Trending Themes</h3>
            <div className="flex flex-wrap gap-2">
                {['AgriTech', 'Climate Action', 'Youth Employment', 'Gender Equality'].map(t => (
                    <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full hover:bg-gray-100 cursor-pointer border border-gray-200">{t}</span>
                ))}
            </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-5 text-white">
            <h3 className="font-bold text-lg mb-2">Have a project idea?</h3>
            <p className="text-blue-100 text-sm mb-4">Collaborate with experts and organizations across sectors.</p>
            <button onClick={onViewProject} className="w-full py-2 bg-white text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-50 transition">
                Create Project
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;

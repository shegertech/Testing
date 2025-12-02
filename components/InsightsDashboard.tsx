import React, { useState } from 'react';
import { api } from '../services/mockStore';
import { User, Insight, ProjectStatus } from '../types';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  user: User;
}

const InsightsDashboard: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'create'>('all');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Only show SHARED to everyone, but show owned items regardless of status
  const allInsights = api.insights.getAll();
  const visibleInsights = allInsights.filter(i => i.status === ProjectStatus.SHARED || i.authorId === user.id);

  const handleCreate = () => {
    api.insights.create({
      id: `i${Date.now()}`,
      title,
      description: desc,
      authorId: user.id,
      status: ProjectStatus.PENDING, // Pending approval
      attachments: [],
      createdAt: new Date().toISOString()
    });
    alert("Insight submitted for review!");
    setActiveTab('all');
    setTitle('');
    setDesc('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <button 
          onClick={() => setActiveTab(activeTab === 'all' ? 'create' : 'all')}
          className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
        >
          {activeTab === 'all' ? 'Create Insight' : 'View All'}
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Share an Idea</h2>
          <div className="space-y-4">
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea 
              className="w-full p-2 border rounded" 
              rows={5} 
              placeholder="What's on your mind?"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Post Insight</button>
            <p className="text-xs text-gray-500 mt-2">Posts require approval before appearing in the public feed.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleInsights.map(i => {
             const author = api.users.getById(i.authorId);
             const isMine = i.authorId === user.id;
             return (
              <div key={i.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2">{i.title}</h3>
                    {isMine && (
                        <div className="flex-shrink-0 ml-2">
                             {i.status === ProjectStatus.PENDING && (
                                <span className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    <Clock className="w-3 h-3 mr-1" /> Pending
                                </span>
                             )}
                             {i.status === ProjectStatus.REJECTED && (
                                <span className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                                </span>
                             )}
                             {i.status === ProjectStatus.SHARED && (
                                <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Live
                                </span>
                             )}
                        </div>
                    )}
                </div>
                <p className="text-gray-500 text-sm mb-4">By {author?.name} on {new Date(i.createdAt).toDateString()}</p>
                <p className="text-gray-700">{i.description}</p>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard;
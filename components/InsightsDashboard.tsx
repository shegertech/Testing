
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Insight, ProjectStatus } from '../types';
import { Clock, AlertCircle, CheckCircle, Loader, X, MessageSquare, Share2, Trash2 } from 'lucide-react';

interface Props {
  user: User;
}

const InsightsDashboard: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'create'>('all');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    const all = await api.insights.getAll();
    setInsights(all);
    
    // Fetch Authors
    const map: Record<string, string> = {};
    for (const i of all) {
       if (!map[i.authorId]) {
         const u = await api.users.getById(i.authorId);
         if (u) map[i.authorId] = u.name;
       }
    }
    setUsersMap(map);
    setLoading(false);
  };

  // Only show SHARED to everyone, but show owned items regardless of status
  const visibleInsights = insights.filter(i => i.status === ProjectStatus.SHARED || i.authorId === user.id);

  const handleCreate = async () => {
    await api.insights.create({
      id: `i${Date.now()}`,
      title,
      description: desc,
      authorId: user.id,
      status: ProjectStatus.PENDING, // Pending approval
      attachments: [],
      createdAt: new Date().toISOString()
    });
    alert("Insight submitted for review!");
    await fetchInsights();
    setActiveTab('all');
    setTitle('');
    setDesc('');
  };

  const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this insight?")) {
          try {
              await api.insights.delete(id);
              alert("Insight deleted.");
              if (selectedInsight?.id === id) setSelectedInsight(null);
              fetchInsights();
          } catch (e) {
              console.error(e);
              alert("Failed to delete insight.");
          }
      }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedInsight(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedInsight(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start mb-2">
                 <h2 className="text-3xl font-bold text-gray-900">{selectedInsight.title}</h2>
                 <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
                    {selectedInsight.authorId === user.id && (
                        <>
                            {selectedInsight.status === ProjectStatus.PENDING && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Pending</span>}
                            {selectedInsight.status === ProjectStatus.REJECTED && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Rejected</span>}
                        </>
                    )}
                 </div>
              </div>
              <p className="text-sm text-gray-500">
                Posted by <span className="font-semibold text-gray-900">{usersMap[selectedInsight.authorId] || 'Unknown'}</span> on {new Date(selectedInsight.createdAt).toDateString()}
              </p>
            </div>
            <div className="prose max-w-none text-gray-800 leading-relaxed mb-8">
               <p className="whitespace-pre-wrap">{selectedInsight.description}</p>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-amber-600 transition">
                        <MessageSquare className="w-5 h-5 mr-2" /> Comment
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-amber-600 transition">
                        <Share2 className="w-5 h-5 mr-2" /> Share
                    </button>
                </div>
                <div className="flex space-x-3">
                    {selectedInsight.authorId === user.id && (
                        <button 
                            onClick={() => handleDelete(selectedInsight.id)}
                            className="text-sm text-gray-400 hover:text-red-600 flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1"/> Delete
                        </button>
                    )}
                    <button 
                        onClick={() => setSelectedInsight(null)}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <button 
          onClick={() => setActiveTab(activeTab === 'all' ? 'create' : 'all')}
          className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
        >
          {activeTab === 'all' ? 'Create Insight' : 'View All'}
        </button>
      </div>

      {loading && activeTab !== 'create' ? (
         <div className="flex justify-center p-10"><Loader className="animate-spin text-gray-400"/></div> 
      ) : (
        <>
            {activeTab === 'create' ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Share an Idea</h2>
                <div className="space-y-4">
                    <input 
                    className="w-full p-2 border rounded text-gray-900 placeholder-gray-500" 
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    />
                    <textarea 
                    className="w-full p-2 border rounded text-gray-900 placeholder-gray-500" 
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
                {visibleInsights.length === 0 && <p className="text-gray-500 text-center py-10">No insights found.</p>}
                {visibleInsights.map(i => {
                    const authorName = usersMap[i.authorId] || 'Unknown';
                    const isMine = i.authorId === user.id;
                    return (
                    <div key={i.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative hover:border-amber-300 transition">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{i.title}</h3>
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
                        <p className="text-gray-500 text-sm mb-4">By {authorName} on {new Date(i.createdAt).toDateString()}</p>
                        <p className="text-gray-700 line-clamp-3 mb-4">{i.description}</p>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex gap-2">
                                {isMine && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(i.id); }}
                                        className="text-gray-400 hover:text-red-600 p-1"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button 
                                onClick={() => setSelectedInsight(i)}
                                className="text-amber-600 text-sm font-medium hover:underline"
                            >
                                View Insight
                            </button>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default InsightsDashboard;

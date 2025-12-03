
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserRole, FundingOpportunity, ProjectStatus } from '../types';
import { Lock, Clock, AlertCircle, CheckCircle, Loader, ArrowLeft, X, Share2, ExternalLink, Trash2 } from 'lucide-react';

interface Props {
  user: User;
}

const FundingDashboard: React.FC<Props> = ({ user }) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<FundingOpportunity | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [applicationInfo, setApplicationInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      const fetchFunding = async () => {
          setLoading(true);
          const all = await api.funding.getAll();
          setOpportunities(all.filter(o => o.status === ProjectStatus.SHARED || o.ownerId === user.id));
          setLoading(false);
      };
      fetchFunding();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
        alert("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    try {
        await api.funding.create({
            id: `f${Date.now()}`,
            title,
            description,
            deadline,
            eligibility,
            applicationInfo,
            ownerId: user.id,
            status: ProjectStatus.PENDING, // Pending approval
            createdAt: new Date().toISOString()
        });
        alert("Opportunity submitted for admin review!");
        
        // Reset form
        setTitle('');
        setDescription('');
        setDeadline('');
        setEligibility('');
        setApplicationInfo('');
        
        // Refresh list
        const all = await api.funding.getAll();
        setOpportunities(all.filter(o => o.status === ProjectStatus.SHARED || o.ownerId === user.id));
        setView('list');
    } catch (err) {
        console.error(err);
        alert("Failed to post opportunity. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this funding opportunity?")) {
          try {
              await api.funding.delete(id);
              alert("Opportunity deleted.");
              if (selectedOpportunity?.id === id) setSelectedOpportunity(null);
              // Refresh
              const all = await api.funding.getAll();
              setOpportunities(all.filter(o => o.status === ProjectStatus.SHARED || o.ownerId === user.id));
          } catch (e) {
              console.error(e);
              alert("Failed to delete.");
          }
      }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedOpportunity(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedOpportunity(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start mb-2">
                 <h2 className="text-3xl font-bold text-gray-900">{selectedOpportunity.title}</h2>
                 <div className="flex flex-col items-end">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold mb-1">Grant</span>
                    <span className="text-sm text-gray-500">Deadline: {new Date(selectedOpportunity.deadline).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
            
            <div className="space-y-6 text-gray-800">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                    <p className="whitespace-pre-wrap">{selectedOpportunity.description}</p>
                </div>
                
                {selectedOpportunity.eligibility && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Eligibility</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                            {selectedOpportunity.eligibility}
                        </div>
                    </div>
                )}

                {selectedOpportunity.applicationInfo && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">How to Apply</h3>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900">
                            {selectedOpportunity.applicationInfo}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-8">
                <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-green-600 transition">
                        <Share2 className="w-5 h-5 mr-2" /> Share Opportunity
                    </button>
                </div>
                <div className="flex space-x-3">
                    {selectedOpportunity.ownerId === user.id && (
                        <button 
                            onClick={() => handleDelete(selectedOpportunity.id)}
                            className="text-sm text-gray-400 hover:text-red-600 flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1"/> Delete
                        </button>
                    )}
                    <button 
                        onClick={() => setSelectedOpportunity(null)}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Funding Opportunities</h1>
            <p className="text-gray-500">Find grants and resources for your impact projects.</p>
        </div>
        <button 
            onClick={() => setView(view === 'list' ? 'create' : 'list')}
            className={`px-4 py-2 rounded-md font-medium transition ${view === 'list' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
            {view === 'list' ? 'Post Opportunity' : 'Back to List'}
        </button>
      </div>

      {loading && view !== 'create' ? <div className="flex justify-center p-10"><Loader className="animate-spin text-gray-400"/></div> : (
        <>
            {view === 'create' ? (
                user.role === UserRole.PREMIUM || user.role === UserRole.ADMIN ? (
                    <div className="bg-white p-8 rounded-lg shadow border border-gray-200 max-w-3xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Post a Funding Opportunity</h2>
                            <p className="text-sm text-gray-500">Share grants, challenges, or funding calls with the community.</p>
                        </div>
                        
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Opportunity Title *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g. Innovation Grant 2025"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea 
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                    placeholder="Describe the opportunity, goals, and funding amount..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Application Deadline *</label>
                                <input 
                                    type="date" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                                <textarea 
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                    value={eligibility}
                                    onChange={e => setEligibility(e.target.value)}
                                    placeholder="Who can apply? (e.g. Registered NGOs, Startups in East Africa)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">How to Apply</label>
                                <textarea 
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                    value={applicationInfo}
                                    onChange={e => setApplicationInfo(e.target.value)}
                                    placeholder="Application steps or link to external portal..."
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-6">
                                <p className="text-xs text-gray-500">
                                    Submissions are reviewed by admins before publishing.
                                </p>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-green-600 text-white px-6 py-2.5 rounded-md hover:bg-green-700 font-medium disabled:opacity-50 flex items-center"
                                >
                                    {isSubmitting && <Loader className="animate-spin w-4 h-4 mr-2" />}
                                    {isSubmitting ? 'Submitting...' : 'Post Opportunity'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
                        <p className="mb-6 max-w-md mx-auto text-gray-300">
                            Posting funding opportunities is available for Premium users only. Upgrade your account to share your resources.
                        </p>
                        <button 
                            onClick={() => alert("This would open the payment flow.")}
                            className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition"
                        >
                            Upgrade to Premium
                        </button>
                    </div>
                )
            ) : (
                <div className="grid gap-6">
                    {opportunities.length === 0 && <p className="text-gray-500 text-center py-12">No opportunities available right now.</p>}
                    {opportunities.map(opp => {
                        const isMine = opp.ownerId === user.id;
                        return (
                        <div key={opp.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-200 transition relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{opp.title}</h3>
                                    <p className="text-sm text-green-700 font-medium mt-1">Deadline: {new Date(opp.deadline).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="bg-green-50 text-green-700 px-2 py-1 text-xs rounded-full border border-green-100">Grant</span>
                                    {isMine && (
                                        <>
                                            {opp.status === ProjectStatus.PENDING && (
                                                <span className="flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                    <Clock className="w-3 h-3 mr-1" /> Pending
                                                </span>
                                            )}
                                            {opp.status === ProjectStatus.REJECTED && (
                                                <span className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                                    <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600 mt-3 line-clamp-2">{opp.description}</p>
                            
                            {opp.eligibility && (
                                <div className="mt-3 text-sm text-gray-500 line-clamp-1">
                                    <span className="font-semibold text-gray-700">Eligibility:</span> {opp.eligibility}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                 <div className="flex gap-2">
                                    {isMine && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(opp.id); }}
                                            className="text-gray-400 hover:text-red-600 p-1"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedOpportunity(opp)}
                                    className="text-green-600 text-sm font-medium hover:underline"
                                >
                                    View Funding
                                </button>
                            </div>
                        </div>
                    )})}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default FundingDashboard;

import React, { useState } from 'react';
import { api } from '../services/mockStore';
import { User, UserRole, FundingOpportunity, ProjectStatus } from '../types';
import { Lock } from 'lucide-react';

interface Props {
  user: User;
}

const FundingDashboard: React.FC<Props> = ({ user }) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const opportunities = api.funding.getAll();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified create logic
    api.funding.create({
        id: `f${Date.now()}`,
        title: 'New Grant',
        description: 'Mock Description',
        deadline: '2025-12-31',
        eligibility: 'All',
        applicationInfo: 'Apply',
        ownerId: user.id,
        status: ProjectStatus.SHARED,
        createdAt: new Date().toISOString()
    });
    setView('list');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Funding Opportunities</h1>
            <p className="text-gray-500">Find grants and resources for your impact projects.</p>
        </div>
        <button 
            onClick={() => setView(view === 'list' ? 'create' : 'list')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
        >
            {view === 'list' ? 'Post Opportunity' : 'Back to List'}
        </button>
      </div>

      {view === 'create' ? (
        user.role === UserRole.PREMIUM ? (
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Post a Funding Opportunity</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <p className="text-gray-500 italic">Form simplified for demo...</p>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Mock Opportunity</button>
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
            {opportunities.map(opp => (
                <div key={opp.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-200 transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{opp.title}</h3>
                            <p className="text-sm text-green-700 font-medium mt-1">Deadline: {opp.deadline}</p>
                        </div>
                        <span className="bg-green-50 text-green-700 px-2 py-1 text-xs rounded-full border border-green-100">Grant</span>
                    </div>
                    <p className="text-gray-600 mt-3">{opp.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <button className="text-blue-600 text-sm font-medium hover:underline">View Details & Apply</button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FundingDashboard;

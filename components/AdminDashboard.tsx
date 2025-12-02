import React, { useState, useEffect } from 'react';
import { api } from '../services/mockStore';
import { Project, Insight, FundingOpportunity, ProjectStatus } from '../types';
import { Check, X, Eye, FileText, Lightbulb, DollarSign, AlertCircle } from 'lucide-react';

interface PendingItemProps {
  id: string;
  title: string;
  desc: string;
  author: string;
  date: string;
  type: 'project' | 'insight' | 'funding';
  onApprove: (type: 'project' | 'insight' | 'funding', id: string) => void;
  onReject: (type: 'project' | 'insight' | 'funding', id: string) => void;
}

const PendingItem: React.FC<PendingItemProps> = ({ 
  title, desc, author, date, type, id, onApprove, onReject 
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {type}
          </span>
          <span className="text-sm text-gray-500">by {author} • {new Date(date).toLocaleDateString()}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>
    </div>
    <div className="flex space-x-3">
      <button 
        onClick={() => onReject(type, id)}
        className="flex items-center px-3 py-2 border border-red-200 text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition"
      >
        <X className="w-4 h-4 mr-1.5" /> Reject
      </button>
      <button 
        onClick={() => onApprove(type, id)}
        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm"
      >
        <Check className="w-4 h-4 mr-1.5" /> Approve
      </button>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [funding, setFunding] = useState<FundingOpportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'insights' | 'funding'>('projects');

  const fetchData = () => {
    setProjects(api.projects.getAll().filter(p => p.status === ProjectStatus.PENDING));
    setInsights(api.insights.getAll().filter(i => i.status === ProjectStatus.PENDING));
    setFunding(api.funding.getAll().filter(f => f.status === ProjectStatus.PENDING));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = (type: 'project' | 'insight' | 'funding', id: string) => {
    if (type === 'project') {
      const item = api.projects.getAll().find(p => p.id === id);
      if (item) api.projects.update({ ...item, status: ProjectStatus.SHARED });
    } else if (type === 'insight') {
      const item = api.insights.getAll().find(i => i.id === id);
      if (item) api.insights.update({ ...item, status: ProjectStatus.SHARED });
    } else {
      const item = api.funding.getAll().find(f => f.id === id);
      if (item) api.funding.update({ ...item, status: ProjectStatus.SHARED });
    }
    fetchData();
  };

  const handleReject = (type: 'project' | 'insight' | 'funding', id: string) => {
    if (type === 'project') {
      const item = api.projects.getAll().find(p => p.id === id);
      if (item) api.projects.update({ ...item, status: ProjectStatus.REJECTED });
    } else if (type === 'insight') {
      const item = api.insights.getAll().find(i => i.id === id);
      if (item) api.insights.update({ ...item, status: ProjectStatus.REJECTED });
    } else {
      const item = api.funding.getAll().find(f => f.id === id);
      if (item) api.funding.update({ ...item, status: ProjectStatus.REJECTED });
    }
    fetchData();
  };

  const getUserName = (id: string) => {
      const u = api.users.getById(id);
      return u ? u.name : 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-200">Review and manage pending content submissions.</p>
      </div>

      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('projects')}
          className={`flex items-center px-6 py-3 border-b-2 font-medium transition ${activeTab === 'projects' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <BriefcaseIcon className="w-4 h-4 mr-2" /> Projects <span className="ml-2 bg-gray-100 text-gray-600 px-2 rounded-full text-xs">{projects.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex items-center px-6 py-3 border-b-2 font-medium transition ${activeTab === 'insights' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Lightbulb className="w-4 h-4 mr-2" /> Insights <span className="ml-2 bg-gray-100 text-gray-600 px-2 rounded-full text-xs">{insights.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('funding')}
          className={`flex items-center px-6 py-3 border-b-2 font-medium transition ${activeTab === 'funding' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <DollarSign className="w-4 h-4 mr-2" /> Funding <span className="ml-2 bg-gray-100 text-gray-600 px-2 rounded-full text-xs">{funding.length}</span>
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'projects' && (
            projects.length === 0 ? <EmptyState label="Projects" /> :
            projects.map(p => (
                <PendingItem 
                  key={p.id} 
                  id={p.id} 
                  type="project" 
                  title={p.title} 
                  desc={p.description} 
                  author={getUserName(p.ownerId)} 
                  date={p.createdAt} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
            ))
        )}
        {activeTab === 'insights' && (
            insights.length === 0 ? <EmptyState label="Insights" /> :
            insights.map(i => (
                <PendingItem 
                  key={i.id} 
                  id={i.id} 
                  type="insight" 
                  title={i.title} 
                  desc={i.description} 
                  author={getUserName(i.authorId)} 
                  date={i.createdAt}
                  onApprove={handleApprove}
                  onReject={handleReject} 
                />
            ))
        )}
        {activeTab === 'funding' && (
            funding.length === 0 ? <EmptyState label="Funding Opportunities" /> :
            funding.map(f => (
                <PendingItem 
                  key={f.id} 
                  id={f.id} 
                  type="funding" 
                  title={f.title} 
                  desc={f.description} 
                  author={getUserName(f.ownerId)} 
                  date={f.createdAt}
                  onApprove={handleApprove}
                  onReject={handleReject} 
                />
            ))
        )}
      </div>
    </div>
  );
};

const BriefcaseIcon = ({className}: {className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
)

const EmptyState = ({ label }: { label: string }) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-gray-900 font-medium">No Pending {label}</h3>
        <p className="text-gray-500 text-sm">All submissions have been reviewed.</p>
    </div>
);

export default AdminDashboard;
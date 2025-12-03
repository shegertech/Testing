import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, Insight, FundingOpportunity, ProjectStatus, User, UserRole, CollaboratorRole } from '../types';
import { 
  Check, X, Eye, FileText, Lightbulb, DollarSign, AlertCircle, 
  Users, Database, Activity, Trash2, Shield, Search, Loader, RefreshCw, Server
} from 'lucide-react';

// --- Sub-components ---

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
}) => {
  const [processing, setProcessing] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setProcessing(true);
    if (action === 'approve') await onApprove(type, id);
    else await onReject(type, id);
    setProcessing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 animate-fade-in">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
              type === 'project' ? 'bg-blue-100 text-blue-700' :
              type === 'insight' ? 'bg-amber-100 text-amber-700' :
              'bg-green-100 text-green-700'
            }`}>
                {type}
            </span>
            <span className="text-sm text-gray-500">by {author} • {new Date(date).toLocaleDateString()}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => handleAction('reject')}
          disabled={processing}
          className="flex items-center px-3 py-2 border border-red-200 text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition text-sm disabled:opacity-50"
        >
          <X className="w-4 h-4 mr-1.5" /> {processing ? '...' : 'Reject'}
        </button>
        <button 
          onClick={() => handleAction('approve')}
          disabled={processing}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm text-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4 mr-1.5" /> {processing ? '...' : 'Approve'}
        </button>
      </div>
    </div>
  );
};

const UserTableRow: React.FC<{ user: User; onUpdateRole: (id: string, role: UserRole) => void; onDelete: (id: string) => void }> = ({ user, onUpdateRole, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
          {user.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
        {user.stakeholderType}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <select 
        value={user.role}
        onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
        className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
          user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' :
          user.role === UserRole.PREMIUM ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}
      >
        <option value={UserRole.STANDARD}>Standard</option>
        <option value={UserRole.PREMIUM}>Premium</option>
        <option value={UserRole.ADMIN}>Admin</option>
      </select>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900">
        <Trash2 className="w-4 h-4" />
      </button>
    </td>
  </tr>
);

// --- Main Dashboard Component ---

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'database'>('approvals');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [funding, setFunding] = useState<FundingOpportunity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const p = await api.projects.getAll();
    const i = await api.insights.getAll();
    const f = await api.funding.getAll();
    const u = await api.users.getAll();
    
    setProjects(p);
    setInsights(i);
    setFunding(f);
    setUsers(u);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Actions ---

  const handleApprove = async (type: 'project' | 'insight' | 'funding', id: string) => {
    if (type === 'project') {
      const item = projects.find(p => p.id === id);
      if (item) await api.projects.update({ ...item, status: ProjectStatus.SHARED });
    } else if (type === 'insight') {
      const item = insights.find(i => i.id === id);
      if (item) await api.insights.update({ ...item, status: ProjectStatus.SHARED });
    } else {
      const item = funding.find(f => f.id === id);
      if (item) await api.funding.update({ ...item, status: ProjectStatus.SHARED });
    }
    fetchData();
  };

  const handleReject = async (type: 'project' | 'insight' | 'funding', id: string) => {
    if (type === 'project') {
      const item = projects.find(p => p.id === id);
      if (item) await api.projects.update({ ...item, status: ProjectStatus.REJECTED });
    } else if (type === 'insight') {
      const item = insights.find(i => i.id === id);
      if (item) await api.insights.update({ ...item, status: ProjectStatus.REJECTED });
    } else {
      const item = funding.find(f => f.id === id);
      if (item) await api.funding.update({ ...item, status: ProjectStatus.REJECTED });
    }
    fetchData();
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    if (confirm(`Change role of ${userToUpdate.name} to ${newRole}?`)) {
        try {
            // Optimistic Update in UI
            const updatedUsers = users.map(u => 
                u.id === userId ? { ...u, role: newRole } : u
            );
            setUsers(updatedUsers);

            // API Call
            await api.users.update({ ...userToUpdate, role: newRole });
            alert("Role updated successfully!");
        } catch (e) {
            console.error(e);
            alert("Failed to update role.");
            fetchData(); // Revert on failure
        }
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Note: Delete not fully implemented in mock/firebase for safety in this demo
    if (confirm("Are you sure you want to delete this user? (Demo: UI Remove Only)")) {
       const newUsers = users.filter(u => u.id !== userId);
       setUsers(newUsers); 
    }
  };

  const getUserName = (id: string) => {
      const u = users.find(user => user.id === id);
      return u ? u.name : 'Unknown';
  };

  const handleSeedSamples = async () => {
      if (!confirm("This will create 2 Projects, 2 Insights, and 2 Funding opportunities assigned to 'dsfsdf@gmail.com'. Continue?")) return;
      
      setLoading(true);
      try {
          const allUsers = await api.users.getAll();
          const targetEmail = 'dsfsdf@gmail.com';
          const targetUser = allUsers.find(u => u.email.toLowerCase() === targetEmail);

          if (!targetUser) {
              alert(`User ${targetEmail} not found! Please register this user first, then try again.`);
              setLoading(false);
              return;
          }

          // Projects
          await api.projects.create({
              id: `p-seed-1-${Date.now()}`,
              title: "Community Water Filter Initiative",
              description: "Installing solar-powered water filtration units in rural communities to provide clean drinking water and reduce waterborne diseases.",
              thematicArea: "Water, Sanitation, and Hygiene (WASH)",
              country: "Kenya",
              city: "Kisumu",
              ownerId: targetUser.id,
              collaborators: [{ userId: targetUser.id, role: CollaboratorRole.OWNER, status: 'Active' }],
              status: ProjectStatus.SHARED,
              attachments: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              joinRequests: [],
              visibility: 'Public',
              commentCount: 0,
              saveCount: 0
          });

          await api.projects.create({
              id: `p-seed-2-${Date.now()}`,
              title: "Digital Literacy for Seniors",
              description: "Workshops designed to help elderly citizens navigate modern digital services, healthcare portals, and communication tools.",
              thematicArea: "Education",
              country: "Nigeria",
              city: "Lagos",
              ownerId: targetUser.id,
              collaborators: [{ userId: targetUser.id, role: CollaboratorRole.OWNER, status: 'Active' }],
              status: ProjectStatus.SHARED,
              attachments: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              joinRequests: [],
              visibility: 'Public',
              commentCount: 0,
              saveCount: 0
          });

          // Insights
          await api.insights.create({
              id: `i-seed-1-${Date.now()}`,
              title: "Water Scarcity Trends 2025",
              description: "A deep dive into the emerging challenges of water access in sub-Saharan Africa and potential technological solutions.",
              authorId: targetUser.id,
              status: ProjectStatus.SHARED,
              attachments: [],
              createdAt: new Date().toISOString()
          });

          await api.insights.create({
              id: `i-seed-2-${Date.now()}`,
              title: "Bridging the Digital Divide",
              description: "Strategies to improve internet access and digital skills for marginalized groups in urban centers.",
              authorId: targetUser.id,
              status: ProjectStatus.SHARED,
              attachments: [],
              createdAt: new Date().toISOString()
          });

          // Funding
          await api.funding.create({
              id: `f-seed-1-${Date.now()}`,
              title: "Clean Water Innovation Grant",
              description: "Funding available for startups and NGOs developing novel water purification technologies.",
              deadline: "2025-08-15",
              eligibility: "Registered NGOs and Startups",
              applicationInfo: "Submit proposal via portal.",
              ownerId: targetUser.id,
              status: ProjectStatus.SHARED,
              createdAt: new Date().toISOString()
          });

           await api.funding.create({
              id: `f-seed-2-${Date.now()}`,
              title: "Tech Inclusion Fund",
              description: "Grants to support community organizations teaching coding and digital skills.",
              deadline: "2025-09-30",
              eligibility: "Community Groups",
              applicationInfo: "Contact for application package.",
              ownerId: targetUser.id,
              status: ProjectStatus.SHARED,
              createdAt: new Date().toISOString()
          });

          alert("Sample data successfully created and assigned to dsfsdf@gmail.com!");
          fetchData();
      } catch (e: any) {
          console.error(e);
          alert("Error seeding data: " + e.message);
      } finally {
          setLoading(false);
      }
  };

  // Filter pending items
  const pendingProjects = projects.filter(p => p.status === ProjectStatus.PENDING);
  const pendingInsights = insights.filter(i => i.status === ProjectStatus.PENDING);
  const pendingFunding = funding.filter(f => f.status === ProjectStatus.PENDING);
  const totalPending = pendingProjects.length + pendingInsights.length + pendingFunding.length;

  if (loading) return <div className="flex justify-center p-12 text-gray-500"><Loader className="animate-spin mr-2"/> Loading Admin Console...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in">
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-xl shadow-lg flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-blue-400" /> 
                Admin Console
            </h1>
            <p className="text-slate-300">System overview and content moderation.</p>
        </div>
        <div className="flex gap-4 text-center items-center">
            <button 
              onClick={fetchData} 
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition mr-2"
              title="Force Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-xs text-slate-300 uppercase">Users</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-xs text-slate-300 uppercase">Projects</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm relative">
                {totalPending > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">{totalPending}</span>}
                <div className="text-2xl font-bold">{totalPending}</div>
                <div className="text-xs text-slate-300 uppercase">Pending</div>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 bg-white px-4 pt-2 rounded-t-lg shadow-sm">
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center px-6 py-3 border-b-2 font-medium transition ${activeTab === 'approvals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          <Activity className="w-4 h-4 mr-2" /> 
          Approvals
          {totalPending > 0 && <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{totalPending}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-6 py-3 border-b-2 font-medium transition ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          <Users className="w-4 h-4 mr-2" /> 
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('database')}
          className={`flex items-center px-6 py-3 border-b-2 font-medium transition ${activeTab === 'database' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          <Database className="w-4 h-4 mr-2" /> 
          System Data
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0 p-6 min-h-[500px]">
        
        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
            <div className="space-y-6">
                 {totalPending === 0 && (
                     <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                         <Check className="w-16 h-16 mb-4 text-green-200" />
                         <p className="text-lg">All caught up! No pending submissions.</p>
                     </div>
                 )}
                 
                 {pendingProjects.length > 0 && (
                     <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Pending Projects</h3>
                        {pendingProjects.map(p => (
                            <PendingItem 
                                key={p.id} id={p.id} type="project" title={p.title} desc={p.description} 
                                author={getUserName(p.ownerId)} date={p.createdAt} 
                                onApprove={handleApprove} onReject={handleReject}
                            />
                        ))}
                     </div>
                 )}

                 {pendingInsights.length > 0 && (
                     <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Pending Insights</h3>
                        {pendingInsights.map(i => (
                            <PendingItem 
                                key={i.id} id={i.id} type="insight" title={i.title} desc={i.description} 
                                author={getUserName(i.authorId)} date={i.createdAt} 
                                onApprove={handleApprove} onReject={handleReject}
                            />
                        ))}
                     </div>
                 )}

                {pendingFunding.length > 0 && (
                     <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Pending Funding Opps</h3>
                        {pendingFunding.map(f => (
                            <PendingItem 
                                key={f.id} id={f.id} type="funding" title={f.title} desc={f.description} 
                                author={getUserName(f.ownerId)} date={f.createdAt} 
                                onApprove={handleApprove} onReject={handleReject}
                            />
                        ))}
                     </div>
                 )}
            </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users
                                .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.includes(searchTerm.toLowerCase()))
                                .map(user => (
                                    <UserTableRow 
                                        key={user.id} 
                                        user={user} 
                                        onUpdateRole={handleUpdateUserRole} 
                                        onDelete={handleDeleteUser} 
                                    />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* DATABASE TAB */}
        {activeTab === 'database' && (
            <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-blue-900 mb-1">System Status</h3>
                        <p className="text-sm text-blue-700">
                             Running asynchronous operations with Firebase.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-green-700">Online</span>
                    </div>
                </div>

                <div className="border border-indigo-100 bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
                        <Server className="w-5 h-5 mr-2" /> Developer Tools
                    </h3>
                    <p className="text-sm text-indigo-700 mb-4">
                        Quickly populate the database for testing purposes.
                    </p>
                    <button 
                        onClick={handleSeedSamples}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center shadow-sm"
                    >
                        <Database className="w-4 h-4 mr-2" /> Seed Data for 'dsfsdf@gmail.com'
                    </button>
                    <p className="text-xs text-indigo-500 mt-2">
                        Note: User must already exist in the Users list.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 font-bold text-sm text-gray-700 border-b border-gray-200 flex justify-between">
                            <span>Projects JSON</span>
                            <span className="bg-gray-200 px-2 rounded text-xs py-0.5">{projects.length} records</span>
                        </div>
                        <div className="p-0 max-h-60 overflow-y-auto bg-slate-50">
                            <pre className="text-xs text-gray-600 p-4 font-mono whitespace-pre-wrap">
                                {JSON.stringify(projects.map(p => ({id: p.id, title: p.title, status: p.status})), null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
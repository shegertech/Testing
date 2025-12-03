
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Project, Insight } from '../types';
import { 
  MessageSquare, Share2, Users, MapPin, Loader, X, Eye,
  Facebook, Twitter, Linkedin, Link, Copy, MessageCircle, Send, Instagram
} from 'lucide-react';

interface HomeFeedProps {
  user: User;
  onViewProject: (project: Project) => void;
  onCreateProject: () => void;
}

// Reusable Share Modal for Home Feed (Projects + Insights)
const ShareModal: React.FC<{ item: Project | Insight; type: 'project' | 'insight'; onClose: () => void }> = ({ item, type, onClose }) => {
  const url = `${window.location.origin}?${type}=${item.id}`;
  const text = `Check out this ${type} on Ponsectors: ${item.title}`;
  
  const shareLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` 
    },
    { 
      name: 'X', 
      icon: Twitter, 
      color: 'text-black', 
      bg: 'bg-gray-100',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'text-blue-700', 
      bg: 'bg-blue-50',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` 
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'text-green-500', 
      bg: 'bg-green-50',
      href: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}` 
    },
    { 
      name: 'Telegram', 
      icon: Send, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` 
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Share {type === 'project' ? 'Project' : 'Insight'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {shareLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-3 rounded-xl hover:opacity-80 transition ${link.bg}`}
            >
              <link.icon className={`w-6 h-6 ${link.color} mb-2`} />
              <span className="text-xs font-medium text-gray-700">{link.name}</span>
            </a>
          ))}
          <button 
             onClick={handleCopy}
             className="flex flex-col items-center justify-center p-3 rounded-xl hover:opacity-80 transition bg-pink-50"
          >
             <Instagram className="w-6 h-6 text-pink-600 mb-2" />
             <span className="text-xs font-medium text-gray-700">Instagram</span>
          </button>
        </div>

        <div className="relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Link className="h-4 w-4 text-gray-400" />
           </div>
           <input 
             type="text" 
             readOnly 
             value={url} 
             className="block w-full pl-9 pr-12 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg bg-gray-50" 
           />
           <button 
             onClick={handleCopy}
             className="absolute inset-y-0 right-0 px-3 flex items-center border-l border-gray-200 text-gray-500 hover:text-blue-600"
           >
             <Copy className="h-4 w-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

const HomeFeed: React.FC<HomeFeedProps> = ({ user, onViewProject, onCreateProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [viewingInsight, setViewingInsight] = useState<Insight | null>(null);
  
  // State for Sharing
  const [sharingItem, setSharingItem] = useState<{ item: Project | Insight, type: 'project' | 'insight' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const allProjects = await api.projects.getAll();
            const allInsights = await api.insights.getAll();
            setProjects(allProjects.filter(p => p.status === 'Shared'));
            setInsights(allInsights.filter(i => i.status === 'Shared'));
            
            // Prefetch user names for feed
            const allUsers = await api.users.getAll();
            const uMap: Record<string, string> = {};
            allUsers.forEach(u => uMap[u.id] = `${u.name} (${u.stakeholderType})`);
            setUsersMap(uMap);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const getUserName = (id: string) => usersMap[id] || 'Unknown User';

  // Merge and sort
  const feedItems = [
    ...projects.map(p => ({ type: 'project', data: p, date: p.createdAt })),
    ...insights.map(i => ({ type: 'insight', data: i, date: i.createdAt }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) return <div className="flex justify-center p-10 text-gray-400"><Loader className="animate-spin mr-2"/> Loading feed...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Share Modal */}
      {sharingItem && (
        <ShareModal 
            item={sharingItem.item} 
            type={sharingItem.type} 
            onClose={() => setSharingItem(null)} 
        />
      )}

      {/* Insight Detail Modal */}
      {viewingInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={() => setViewingInsight(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingInsight(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                 <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase">Insight</span>
                 <span className="text-sm text-gray-500">by {getUserName(viewingInsight.authorId)}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{viewingInsight.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{new Date(viewingInsight.createdAt).toDateString()}</p>
            </div>
            <div className="prose max-w-none text-gray-800">
               <p className="whitespace-pre-wrap">{viewingInsight.description}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end space-x-4">
                <button className="flex items-center text-gray-500 hover:text-blue-600">
                  <MessageSquare className="w-4 h-4 mr-1.5" /> Comment
                </button>
                <button 
                  onClick={() => setSharingItem({ item: viewingInsight, type: 'insight' })}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  <Share2 className="w-4 h-4 mr-1.5" /> Share
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Your Feed</h2>
            <div className="text-sm text-gray-500">Latest Updates</div>
        </div>

        {feedItems.length === 0 && <div className="text-center py-10 text-gray-500">No recent activity.</div>}

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
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600" onClick={() => onViewProject(p)}>
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
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSharingItem({ item: p, type: 'project' }); }}
                      className="flex items-center text-gray-500 hover:text-blue-600 text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-1.5" /> Share
                    </button>
                  </div>
                  <button onClick={() => onViewProject(p)} className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
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
                <p className="text-gray-600 mb-4 line-clamp-3">{i.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-amber-600 text-sm">
                      <MessageSquare className="w-4 h-4 mr-1.5" /> Comment
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSharingItem({ item: i, type: 'insight' }); }}
                      className="flex items-center text-gray-500 hover:text-amber-600 text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-1.5" /> Share
                    </button>
                  </div>
                  <button 
                    onClick={() => setViewingInsight(i)}
                    className="flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium hover:underline"
                  >
                     View Insight
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
            <button onClick={onCreateProject} className="w-full py-2 bg-white text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-50 transition">
                Create Project
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;


import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Project, ProjectStatus, CollaboratorRole, Comment, Attachment } from '../types';
import { THEMATIC_AREAS, COUNTRIES } from '../constants';
import { Search, Upload, X, FileText, Image as ImageIcon, Users, Download, Send, MessageSquare, Share2, UserPlus, Clock, AlertCircle, Loader, Bookmark, Edit } from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser?: (u: User) => void;
}

type Tab = 'my-projects' | 'create' | 'portfolio' | 'detail';

// --- Sub Components ---

const ProjectCard: React.FC<{ 
  project: Project; 
  user: User;
  onSelect: (p: Project) => void; 
  onEdit: (p: Project) => void;
  showActions?: boolean 
}> = ({ project, user, onSelect, onEdit, showActions = false }) => {
  const isOwner = project.ownerId === user.id;
  const isCollaborator = project.collaborators.some(c => c.userId === user.id);
  const showJoin = !isOwner && !isCollaborator;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Share link copied for project: ${project.title}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Request to join sent for project: ${project.title}`);
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition mb-4 flex flex-col h-full relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 
            className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600 line-clamp-1"
            onClick={() => onSelect(project)}
          >
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{project.thematicArea} • {project.country}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
            {project.status === ProjectStatus.DRAFT && (
            <span className="flex-shrink-0 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Draft</span>
            )}
            {project.status === ProjectStatus.PENDING && (
            <span className="flex-shrink-0 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Pending
            </span>
            )}
            {project.status === ProjectStatus.REJECTED && (
            <span className="flex-shrink-0 px-2 py-1 bg-red-100 text-red-800 text-xs rounded flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> Rejected
            </span>
            )}
        </div>
      </div>
      <p className="text-gray-600 mt-3 text-sm line-clamp-2 flex-grow">{project.description}</p>
      
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
             <div className="flex space-x-4">
               <button 
                  onClick={() => onSelect(project)}
                  className="flex items-center text-gray-500 hover:text-blue-600 text-xs sm:text-sm transition"
                  title="View Comments"
               >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  <span>{project.commentCount}</span>
               </button>
               <button 
                  onClick={handleShare}
                  className="flex items-center text-gray-500 hover:text-blue-600 text-xs sm:text-sm transition"
                  title="Share Project"
               >
                  <Share2 className="w-4 h-4 mr-1.5" />
                  <span>Share</span>
               </button>
             </div>

             <div className="flex space-x-2">
                {showJoin && (
                   <button 
                      onClick={handleJoin}
                      className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-100 transition whitespace-nowrap"
                   >
                      <UserPlus className="w-4 h-4 mr-1.5" />
                      Request to Join
                   </button>
                )}
                {isOwner && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(project); }} 
                        className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2"
                    >
                        Edit
                    </button>
                )}
             </div>
        </div>
      )}
    </div>
  );
};

interface CreateFormProps {
  newProject: Partial<Project>;
  setNewProject: (p: Partial<Project>) => void;
  inviteEmails: string;
  setInviteEmails: (s: string) => void;
  selectedFiles: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (i: number) => void;
  removeExistingAttachment: (i: number) => void;
  handleCreate: (status: ProjectStatus) => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

const CreateForm: React.FC<CreateFormProps> = ({
  newProject, setNewProject, inviteEmails, setInviteEmails, 
  selectedFiles, onFileChange, removeFile, removeExistingAttachment, handleCreate, isSubmitting, isEditing
}) => (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Project' : 'Create a New Project'}</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Title *</label>
        <input 
          type="text" 
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={newProject.title}
          onChange={e => setNewProject({...newProject, title: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea 
          rows={5}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={newProject.description}
          onChange={e => setNewProject({...newProject, description: e.target.value})}
          placeholder="Describe the problem, objectives, and expected impact..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-700">Thematic Area</label>
              <select 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={newProject.thematicArea}
                  onChange={e => setNewProject({...newProject, thematicArea: e.target.value})}
              >
                  {THEMATIC_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <select 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={newProject.country}
                  onChange={e => setNewProject({...newProject, country: e.target.value})}
              >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
          </div>
      </div>
      {!isEditing && (
        <div>
           <label className="block text-sm font-medium text-gray-700">Invite Collaborators (Emails)</label>
           <input 
            type="text" 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="email1@example.com, email2@example.com"
            value={inviteEmails}
            onChange={e => setInviteEmails(e.target.value)}
          />
        </div>
      )}
      
      {/* File Upload Section */}
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          
          {/* Existing Attachments */}
          {newProject.attachments && newProject.attachments.length > 0 && (
             <div className="mb-4 space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase">Existing Files:</p>
                {newProject.attachments.map((file, index) => (
                    <div key={`existing-${index}`} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3 overflow-hidden">
                             <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <div className="truncate">
                                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeExistingAttachment(index)}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
             </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input 
                  type="file" 
                  multiple 
                  onChange={onFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG, PNG (max 10MB)</p>
          </div>

          {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                  <p className="text-xs text-green-600 font-semibold uppercase">New Files to Upload:</p>
                  {selectedFiles.map((file, index) => (
                      <div key={`new-${index}`} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3 overflow-hidden">
                              {file.type.startsWith('image/') ? (
                                  <ImageIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                              ) : (
                                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              )}
                              <div className="truncate">
                                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                          </div>
                          <button 
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition"
                          >
                              <X className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
              </div>
          )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
          <button 
              onClick={() => handleCreate(ProjectStatus.DRAFT)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
              {isEditing ? 'Save as Draft' : 'Save as Draft'}
          </button>
          <button 
              onClick={() => handleCreate(isEditing ? newProject.status || ProjectStatus.SHARED : ProjectStatus.PENDING)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Publish Project'}
          </button>
      </div>
      {!isEditing && (
        <p className="text-xs text-gray-500 text-right mt-2">
            Note: Published projects require admin approval before becoming visible.
        </p>
      )}
    </div>
  </div>
);

const ProjectDetail: React.FC<{ 
    project: Project; 
    user: User; 
    onBack: () => void;
    onUpdateUser?: (u: User) => void;
    onEdit: (p: Project) => void;
}> = ({ project, user, onBack, onUpdateUser, onEdit }) => {
    const [owner, setOwner] = useState<User | null>(null);
    const [comment, setComment] = useState('');
    const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [usersMap, setUsersMap] = useState<Record<string, string>>({});
    
    const isOwner = user.id === project.ownerId;
    const isSaved = user.savedProjectIds?.includes(project.id);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadDetails = async () => {
            const o = await api.users.getById(project.ownerId);
            setOwner(o || null);
            const c = await api.comments.getByParent(project.id);
            setComments(c);
            
            // Resolve commenter names
            const map: Record<string, string> = {};
            for(const com of c) {
                if(!map[com.authorId]) {
                    const u = await api.users.getById(com.authorId);
                    if(u) map[com.authorId] = u.name;
                }
            }
            // Resolve Collaborator names
            for(const col of project.collaborators) {
                 if(!map[col.userId]) {
                     const u = await api.users.getById(col.userId);
                     if(u) map[col.userId] = u.name;
                 }
            }
            setUsersMap(map);
        };
        loadDetails();
    }, [project]);

    const handlePostComment = async () => {
        if(!comment) return;
        const newC = await api.comments.add({
            id: `c${Date.now()}`,
            parentId: project.id,
            authorId: user.id,
            text: comment,
            createdAt: new Date().toISOString()
        });
        setComments([...comments, newC]);
        setComment('');
    };

    const handleInvite = () => {
        if (!newCollaboratorEmail) return;
        alert(`Invitation sent to ${newCollaboratorEmail}`);
        setNewCollaboratorEmail('');
    };

    const handleToggleSave = async () => {
        if (!onUpdateUser) return;
        setIsSaving(true);
        try {
            const updatedUser = await api.users.toggleSave(user.id, project.id);
            onUpdateUser(updatedUser);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex-1 p-8 border-r border-gray-100">
                <div className="mb-6">
                    <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-4">
                        &larr; Back
                    </button>
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                        <div className="flex items-center space-x-2">
                             {project.status === ProjectStatus.PENDING && (
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> Pending Approval
                                </span>
                            )}
                            {project.status === ProjectStatus.REJECTED && (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                                </span>
                            )}
                            <button 
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                className={`p-2 rounded-full border transition ${isSaved ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300'}`}
                                title={isSaved ? "Unsave Project" : "Save Project"}
                            >
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            {isOwner && (
                                <button 
                                    onClick={() => onEdit(project)}
                                    className="p-2 rounded-full border bg-white border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition"
                                    title="Edit Project"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> Lead: {owner?.name || 'Loading...'}</span>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8">
                    <p>{project.description}</p>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3">Attachments</h3>
                    {project.attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {project.attachments.map((file, idx) => (
                                <a 
                                    key={idx} 
                                    href={file.url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={file.name}
                                    className="flex items-center p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <Download className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No attachments available.</p>
                    )}
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Project Forum</h3>
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                        {comments.length === 0 && <p className="text-gray-400 text-sm">No comments yet. Start the discussion!</p>}
                        {comments.map(c => {
                             const name = usersMap[c.authorId] || (c.authorId === user.id ? user.name : 'Unknown');
                             return (
                                <div key={c.id} className="flex space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                                        {name.charAt(0)}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none">
                                        <div className="text-xs font-bold text-gray-700">{name}</div>
                                        <p className="text-sm text-gray-600">{c.text}</p>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                    <div className="flex space-x-2">
                        <input 
                            type="text"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <button onClick={handlePostComment} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 p-6 bg-gray-50">
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Project Details</h4>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="block text-gray-400 text-xs">Thematic Area</span>
                            <span className="text-gray-800">{project.thematicArea}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs">Location</span>
                            <span className="text-gray-800">{project.city ? `${project.city}, ` : ''}{project.country}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs">Status</span>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                                project.status === ProjectStatus.SHARED ? 'bg-green-100 text-green-700' :
                                project.status === ProjectStatus.PENDING ? 'bg-purple-100 text-purple-700' :
                                project.status === ProjectStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{project.status}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Collaborators</h4>
                    <div className="space-y-3 mb-4">
                        {project.collaborators.map((c, i) => {
                             const name = usersMap[c.userId] || (c.userId === user.id ? user.name : 'Unknown');
                             return (
                                <div key={i} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                                        {name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{name}</div>
                                        <div className="text-xs text-gray-500">{c.role}</div>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                    
                    {/* Add Collaborator Section for Owner */}
                    {isOwner && (
                        <div className="bg-white p-3 rounded-lg border border-dashed border-gray-300">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">Invite Collaborator</h5>
                            <div className="flex flex-col space-y-2">
                                <input 
                                    type="email" 
                                    className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                                    placeholder="Enter email..."
                                    value={newCollaboratorEmail}
                                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                                />
                                <button 
                                    onClick={handleInvite}
                                    disabled={!newCollaboratorEmail}
                                    className="bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Invite
                                </button>
                            </div>
                        </div>
                    )}

                    {!isOwner && project.collaborators.every(c => c.userId !== user.id) && (
                         <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition">
                            Request to Join
                         </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

const ProjectDashboard: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<Tab>('my-projects');
  const [subTab, setSubTab] = useState<'shared' | 'joined' | 'saved'>('shared');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    thematicArea: THEMATIC_AREAS[0],
    country: user.country,
    visibility: 'Public',
    attachments: []
  });
  const [inviteEmails, setInviteEmails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
      setLoading(true);
      const all = await api.projects.getAll();
      setProjects(all);
      setLoading(false);
  };

  // --- Helpers ---
  const mySharedProjects = projects.filter(p => p.ownerId === user.id);
  const myJoinedProjects = projects.filter(p => 
    p.collaborators.some(c => c.userId === user.id && c.role !== CollaboratorRole.OWNER)
  );
  // Filter saved projects based on User's saved list
  const mySavedProjects = projects.filter(p => user.savedProjectIds?.includes(p.id)); 
  const portfolioProjects = projects.filter(p => p.status === ProjectStatus.SHARED && p.visibility === 'Public');

  const handleCreate = async (status: ProjectStatus) => {
    setIsSubmitting(true);
    // Convert files to mock attachments
    const newAttachments: Attachment[] = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file), // Mock URL
      type: file.type,
      size: file.size
    }));
    
    // Combine existing attachments (if editing) with new ones
    const finalAttachments = [
        ...(newProject.attachments || []),
        ...newAttachments
    ];

    const projectData: Project = {
      ...newProject,
      id: newProject.id || `p${Date.now()}`,
      title: newProject.title!,
      description: newProject.description!,
      thematicArea: newProject.thematicArea!,
      country: newProject.country!,
      city: newProject.city || '',
      ownerId: user.id,
      collaborators: newProject.collaborators || [{ userId: user.id, role: CollaboratorRole.OWNER, status: 'Active' }],
      status: status, // Update status
      attachments: finalAttachments,
      createdAt: newProject.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      joinRequests: newProject.joinRequests || [],
      visibility: newProject.visibility as any || 'Public',
      commentCount: newProject.commentCount || 0,
      saveCount: newProject.saveCount || 0
    } as Project;
    
    // Simulate invites only for new projects
    if (inviteEmails && !newProject.id) {
        console.log(`Inviting: ${inviteEmails}`);
    }

    if (newProject.id) {
        await api.projects.update(projectData);
        alert("Project updated successfully!");
    } else {
        await api.projects.create(projectData);
        if (status === ProjectStatus.PENDING) {
            alert("Project submitted for review! It will be visible in the portfolio once approved by an admin.");
        }
    }
    
    await fetchProjects();
    setActiveTab('my-projects');
    setSubTab('shared');
    resetForm();
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setNewProject({ title: '', description: '', thematicArea: THEMATIC_AREAS[0], country: user.country, visibility: 'Public', attachments: [] });
    setInviteEmails('');
    setSelectedFiles([]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
      if (!newProject.attachments) return;
      const updated = [...newProject.attachments];
      updated.splice(index, 1);
      setNewProject({ ...newProject, attachments: updated });
  };

  const handleSelectProject = (project: Project) => {
      setSelectedProject(project);
      setActiveTab('detail');
  };

  const handleEditProject = (project: Project) => {
      setNewProject({ ...project });
      setSelectedFiles([]); // Clear new file selection
      setActiveTab('create');
  };

  return (
    <div>
      {/* Sub Navigation */}
      <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6 inline-flex border border-gray-200">
        <button 
            onClick={() => { setActiveTab('my-projects'); resetForm(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'my-projects' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
            My Projects
        </button>
        <button 
            onClick={() => { setActiveTab('create'); resetForm(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'create' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
            Create Project
        </button>
        <button 
            onClick={() => { setActiveTab('portfolio'); resetForm(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'portfolio' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
            Project Portfolio
        </button>
      </div>

      {loading && activeTab !== 'create' ? (
          <div className="flex justify-center p-10 text-gray-500"><Loader className="animate-spin mr-2" /> Loading projects...</div>
      ) : (
          <>
            {/* Content Area */}
            {activeTab === 'my-projects' && (
                <div className="space-y-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button onClick={() => setSubTab('shared')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${subTab === 'shared' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Shared & Pending</button>
                            <button onClick={() => setSubTab('joined')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${subTab === 'joined' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Joined</button>
                            <button onClick={() => setSubTab('saved')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${subTab === 'saved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Saved</button>
                        </nav>
                    </div>
                    <div className="grid gap-4">
                        {subTab === 'shared' && mySharedProjects.length === 0 && <p className="text-gray-500">You haven't created any projects yet.</p>}
                        {subTab === 'shared' && mySharedProjects.map(p => <ProjectCard key={p.id} project={p} user={user} onSelect={handleSelectProject} onEdit={handleEditProject} showActions />)}
                        
                        {subTab === 'joined' && myJoinedProjects.length === 0 && <p className="text-gray-500">You haven't joined any projects yet.</p>}
                        {subTab === 'joined' && myJoinedProjects.map(p => <ProjectCard key={p.id} project={p} user={user} onSelect={handleSelectProject} onEdit={handleEditProject} showActions />)}
                        
                        {subTab === 'saved' && mySavedProjects.length === 0 && <p className="text-gray-500">You haven't saved any projects yet.</p>}
                        {subTab === 'saved' && mySavedProjects.map(p => <ProjectCard key={p.id} project={p} user={user} onSelect={handleSelectProject} onEdit={handleEditProject} showActions />)}
                    </div>
                </div>
            )}

            {activeTab === 'create' && (
                <CreateForm 
                    newProject={newProject}
                    setNewProject={setNewProject}
                    inviteEmails={inviteEmails}
                    setInviteEmails={setInviteEmails}
                    selectedFiles={selectedFiles}
                    onFileChange={onFileChange}
                    removeFile={removeFile}
                    removeExistingAttachment={removeExistingAttachment}
                    handleCreate={handleCreate}
                    isSubmitting={isSubmitting}
                    isEditing={!!newProject.id}
                />
            )}

            {activeTab === 'portfolio' && (
                <div className="space-y-6">
                    <div className="flex space-x-4 mb-4">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <select className="border border-gray-300 rounded-md px-3 text-sm">
                            <option>All Areas</option>
                            {THEMATIC_AREAS.map(a => <option key={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {portfolioProjects
                            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(p => <ProjectCard key={p.id} project={p} user={user} onSelect={handleSelectProject} onEdit={handleEditProject} showActions />)
                        }
                    </div>
                </div>
            )}

            {activeTab === 'detail' && selectedProject && (
                <ProjectDetail 
                    project={selectedProject} 
                    user={user} 
                    onBack={() => setActiveTab('portfolio')}
                    onUpdateUser={onUpdateUser}
                    onEdit={handleEditProject}
                />
            )}
          </>
      )}
    </div>
  );
};

export default ProjectDashboard;

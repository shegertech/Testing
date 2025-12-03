import { User, Project, Insight, FundingOpportunity, Comment, StakeholderType, UserRole, ProjectStatus, CollaboratorRole } from '../types';

const USERS_KEY = 'ponsectors_users';
const PROJECTS_KEY = 'ponsectors_projects';
const INSIGHTS_KEY = 'ponsectors_insights';
const FUNDING_KEY = 'ponsectors_funding';
const COMMENTS_KEY = 'ponsectors_comments';
const CURRENT_USER_KEY = 'ponsectors_current_user_id';

// --- Seed Data Helper ---
const seedData = () => {
  if (localStorage.getItem(USERS_KEY)) return;

  const demoUsers: User[] = [
    {
      id: 'u1',
      email: 'amir@example.com',
      passwordHash: 'password',
      stakeholderType: StakeholderType.INDIVIDUAL,
      subtype: 'Professional',
      name: 'Amir Musema',
      country: 'Ethiopia',
      city: 'Addis Ababa',
      focusAreas: ['Technology and Innovation', 'Agriculture and Food Security'],
      role: UserRole.STANDARD,
      isVerified: true,
      joinedAt: new Date().toISOString(),
      about: 'Software engineer passionate about agritech.',
      savedProjectIds: []
    },
    {
      id: 'u2',
      email: 'minagri@gov.et',
      passwordHash: 'password',
      stakeholderType: StakeholderType.ORGANIZATION,
      subtype: 'Government Agency',
      name: 'Federal Ministry of Agriculture',
      country: 'Ethiopia',
      city: 'Addis Ababa',
      focusAreas: ['Agriculture and Food Security'],
      role: UserRole.PREMIUM,
      isVerified: true,
      joinedAt: new Date().toISOString(),
      about: 'Leading agricultural development in Ethiopia.',
      savedProjectIds: []
    },
    {
      id: 'admin1',
      email: 'admin@ponsectors.com',
      passwordHash: 'password',
      stakeholderType: StakeholderType.INDIVIDUAL,
      name: 'System Admin',
      country: 'Global',
      city: '',
      focusAreas: [],
      role: UserRole.ADMIN,
      isVerified: true,
      joinedAt: new Date().toISOString(),
      savedProjectIds: []
    }
  ];

  const demoProjects: Project[] = [
    {
      id: 'p1',
      title: 'Urban Farming Initiative',
      description: 'A project to transform urban rooftops into green vegetable gardens to support local food security and reduce heat islands.',
      thematicArea: 'Agriculture and Food Security',
      country: 'Ethiopia',
      city: 'Addis Ababa',
      ownerId: 'u1',
      collaborators: [{ userId: 'u1', role: CollaboratorRole.OWNER, status: 'Active' }],
      status: ProjectStatus.SHARED,
      attachments: [],
      createdAt: new Date(Date.now() - 10000000).toISOString(),
      updatedAt: new Date().toISOString(),
      joinRequests: [],
      visibility: 'Public',
      commentCount: 2,
      saveCount: 5
    },
    {
      id: 'p2',
      title: 'National Soil Health Survey',
      description: 'Comprehensive survey of soil health across 5 major regions to inform fertilizer policy.',
      thematicArea: 'Agriculture and Food Security',
      country: 'Ethiopia',
      city: 'National',
      ownerId: 'u2',
      collaborators: [{ userId: 'u2', role: CollaboratorRole.OWNER, status: 'Active' }],
      status: ProjectStatus.SHARED,
      attachments: [],
      createdAt: new Date(Date.now() - 5000000).toISOString(),
      updatedAt: new Date().toISOString(),
      joinRequests: ['u1'],
      visibility: 'Public',
      commentCount: 0,
      saveCount: 12
    }
  ];

  const demoInsights: Insight[] = [
    {
      id: 'i1',
      title: 'The Future of Agritech in Africa',
      description: 'Reflections on how mobile payments and satellite data are revolutionizing smallholder farming.',
      authorId: 'u1',
      status: ProjectStatus.SHARED,
      attachments: [],
      createdAt: new Date().toISOString()
    }
  ];

  const demoFunding: FundingOpportunity[] = [
    {
      id: 'f1',
      title: 'ArifPay Innovation Challenge',
      description: 'Grants for startups working on financial inclusion in rural areas.',
      deadline: '2025-12-31',
      eligibility: 'Registered startups in Ethiopia.',
      applicationInfo: 'Apply via the portal link...',
      ownerId: 'u2',
      status: ProjectStatus.SHARED,
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(demoProjects));
  localStorage.setItem(INSIGHTS_KEY, JSON.stringify(demoInsights));
  localStorage.setItem(FUNDING_KEY, JSON.stringify(demoFunding));
  localStorage.setItem(COMMENTS_KEY, JSON.stringify([]));
};

seedData();

// --- Helpers ---
const get = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
const delay = (ms: number) => new Promise(res => setTimeout(res, ms)); // Simulate network latency

export const mockApi = {
  // Auth
  users: {
    getAll: async () => { await delay(200); return get<User>(USERS_KEY); },
    getById: async (id: string) => { await delay(100); return get<User>(USERS_KEY).find(u => u.id === id); },
    create: async (user: User) => {
      await delay(500);
      const users = get<User>(USERS_KEY);
      users.push(user);
      set(USERS_KEY, users);
      return user;
    },
    update: async (user: User) => {
      await delay(300);
      const users = get<User>(USERS_KEY);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        // preserve passwordHash if not provided in update
        const existing = users[idx];
        users[idx] = { ...existing, ...user, passwordHash: user.passwordHash || existing.passwordHash };
        set(USERS_KEY, users);
      }
    },
    login: async (email: string, pass: string) => {
      await delay(800);
      const users = get<User>(USERS_KEY);
      return users.find(u => u.email === email && u.passwordHash === pass);
    },
    toggleSave: async (userId: string, projectId: string) => {
      await delay(200);
      const users = get<User>(USERS_KEY);
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        const user = users[idx];
        const saved = user.savedProjectIds || [];
        if (saved.includes(projectId)) {
          user.savedProjectIds = saved.filter(id => id !== projectId);
        } else {
          user.savedProjectIds = [...saved, projectId];
        }
        users[idx] = user;
        set(USERS_KEY, users);
        return user;
      }
      throw new Error("User not found");
    },
    getCurrentUser: async () => {
      const id = localStorage.getItem(CURRENT_USER_KEY);
      if (!id) return null;
      return get<User>(USERS_KEY).find(u => u.id === id) || null;
    },
    setCurrentUser: async (id: string | null) => {
      if (id) localStorage.setItem(CURRENT_USER_KEY, id);
      else localStorage.removeItem(CURRENT_USER_KEY);
    },
    listenToCurrentUser: (callback: (user: User | null) => void) => {
        // Mock implementation: just call it once. 
        // Real-time updates not supported in mock mode without complex eventing.
        const id = localStorage.getItem(CURRENT_USER_KEY);
        if (id) {
            const user = get<User>(USERS_KEY).find(u => u.id === id) || null;
            callback(user);
        } else {
            callback(null);
        }
        return () => {}; // no-op unsubscribe
    }
  },

  // Projects
  projects: {
    getAll: async () => { await delay(300); return get<Project>(PROJECTS_KEY); },
    create: async (project: Project) => {
      await delay(500);
      const projects = get<Project>(PROJECTS_KEY);
      projects.unshift(project);
      set(PROJECTS_KEY, projects);
      return project;
    },
    update: async (project: Project) => {
      await delay(300);
      const projects = get<Project>(PROJECTS_KEY);
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        projects[idx] = project;
        set(PROJECTS_KEY, projects);
      }
    },
    delete: async (id: string) => {
      await delay(300);
      const projects = get<Project>(PROJECTS_KEY).filter(p => p.id !== id);
      set(PROJECTS_KEY, projects);
    }
  },

  // Insights
  insights: {
    getAll: async () => { await delay(200); return get<Insight>(INSIGHTS_KEY); },
    create: async (insight: Insight) => {
      await delay(400);
      const items = get<Insight>(INSIGHTS_KEY);
      items.unshift(insight);
      set(INSIGHTS_KEY, items);
      return insight;
    },
    update: async (insight: Insight) => {
      await delay(300);
      const items = get<Insight>(INSIGHTS_KEY);
      const idx = items.findIndex(i => i.id === insight.id);
      if (idx !== -1) {
        items[idx] = insight;
        set(INSIGHTS_KEY, items);
      }
    },
    delete: async (id: string) => {
      await delay(300);
      set(INSIGHTS_KEY, get<Insight>(INSIGHTS_KEY).filter(i => i.id !== id));
    }
  },

  // Funding
  funding: {
    getAll: async () => { await delay(200); return get<FundingOpportunity>(FUNDING_KEY); },
    create: async (opp: FundingOpportunity) => {
      await delay(400);
      const items = get<FundingOpportunity>(FUNDING_KEY);
      items.unshift(opp);
      set(FUNDING_KEY, items);
      return opp;
    },
    update: async (opp: FundingOpportunity) => {
      await delay(300);
      const items = get<FundingOpportunity>(FUNDING_KEY);
      const idx = items.findIndex(f => f.id === opp.id);
      if (idx !== -1) {
        items[idx] = opp;
        set(FUNDING_KEY, items);
      }
    },
    delete: async (id: string) => {
      await delay(300);
      set(FUNDING_KEY, get<FundingOpportunity>(FUNDING_KEY).filter(f => f.id !== id));
    }
  },
  
  // Comments
  comments: {
    getByParent: async (parentId: string) => { await delay(100); return get<Comment>(COMMENTS_KEY).filter(c => c.parentId === parentId); },
    add: async (comment: Comment) => {
      await delay(200);
      const all = get<Comment>(COMMENTS_KEY);
      all.push(comment);
      set(COMMENTS_KEY, all);
      return comment;
    }
  },

  notifications: {
      getByUser: async (userId: string) => {
          // Mock
          return [];
      },
      create: async (n: any) => { return n; },
      markAsRead: async (id: string) => {}
  }
};
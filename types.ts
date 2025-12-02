export enum StakeholderType {
  INDIVIDUAL = 'Individual',
  ORGANIZATION = 'Organization',
  GROUP = 'Group',
}

export enum UserRole {
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, never store plain text. Mocking here.
  stakeholderType: StakeholderType;
  subtype?: string;
  name: string; // First Last or Org Name
  country: string;
  city: string;
  focusAreas: string[];
  about?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  joinedAt: string;
}

export enum ProjectStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  SHARED = 'Shared',
  REJECTED = 'Rejected',
}

export enum CollaboratorRole {
  OWNER = 'Owner',
  COLLABORATOR = 'Collaborator',
  VIEWER = 'Viewer',
}

export interface Collaborator {
  userId: string;
  role: CollaboratorRole;
  status: 'Active' | 'Pending';
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thematicArea: string;
  country: string;
  city?: string;
  ownerId: string;
  collaborators: Collaborator[];
  status: ProjectStatus;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  joinRequests: string[]; // User IDs requesting to join
  visibility: 'Public' | 'Restricted';
  // Computed/Mocked counters
  commentCount: number;
  saveCount: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  authorId: string;
  status: ProjectStatus;
  attachments: string[];
  createdAt: string;
}

export interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  deadline: string;
  eligibility: string;
  applicationInfo: string;
  ownerId: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface Comment {
  id: string;
  parentId: string; // Project ID or Insight ID
  authorId: string;
  text: string;
  createdAt: string;
}
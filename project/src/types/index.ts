export interface User {
  id: string;
  name: string;
  email: string;
  role: 'maintenance_engineer' | 'station_controller' | 'compliance_officer' | 'executive';
  department: string;
  avatar?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: 'sop' | 'manual' | 'checklist' | 'policy' | 'incident_report';
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  fileUrl?: string;
  version: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  relevanceScore: number;
  document: Document;
  feedback?: 'positive' | 'negative';
}

export interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'update' | 'incident';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  targetRoles: User['role'][];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'document' | 'topic' | 'procedure';
  category: string;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relation: string;
}
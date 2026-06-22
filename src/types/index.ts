export type PanelId = 'about' | 'projects' | 'skills' | 'cv' | 'contact';

export interface StackItem { label: string; color: string; }
export interface Project   { id: string; name: string; desc: string; tags: string[]; grad: string; image?: string; url?: string; }
export interface Skill     { name: string; pct: number; }
export interface CvEntry   { role: string; company: string; period: string; desc?: string; }

export interface SiteContent {
  about: {
    name: string;
    role: string;
    bio: string;
    location: string;
    stack: StackItem[];
    stats: { years: string; projects: string; coffee: string; };
    available: boolean;
  };
  projects: Project[];
  skills: Skill[];
  cv: {
    experience: CvEntry[];
    education: CvEntry[];
    cvUrl: string;
  };
  contact: {
    title: string;
    email: string;
    socials: {
      label: string;
      url: string;
    }[];
  };
}

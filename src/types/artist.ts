export type ArtMedium = 
  | 'Grafite & Papel'
  | 'Pintura Digital'
  | 'Carvão & Sépia'
  | 'Óleo sobre Tela'
  | 'Aquarela & Nanquim';

export type CritiqueFocus = 
  | 'Proporções & Estrutura'
  | 'Perspectiva & Grid'
  | 'Valores Tonais & Luz'
  | 'Anatomia Humana'
  | 'Gesto & Dinâmica';

export interface TechnicalAnalysis {
  overallScore: number;
  proportionScore: number;
  proportionNotes: string;
  perspectiveScore: number;
  perspectiveNotes: string;
  valueScore: number;
  valueNotes: string;
  edgeControlNotes: string;
  prescribedDrills: {
    title: string;
    duration: string;
    instructions: string;
  }[];
}

export interface RedlineMark {
  id: string;
  x: number;
  y: number;
  type: 'correction' | 'guide' | 'note';
  comment: string;
}

export interface CommunityRedline {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  createdAt: string;
  feedbackText: string;
  redlineOverlayImage?: string;
  likesCount: number;
  isVerifiedMentor?: boolean;
}

export interface ArtworkSubmission {
  id: string;
  title: string;
  artistName: string;
  artistHandle: string;
  artistAvatar: string;
  medium: ArtMedium;
  focus: CritiqueFocus;
  originalImage: string;
  valueMapImage?: string;
  structuralOverlayImage?: string;
  createdAt: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  queueProgress?: number;
  analysis?: TechnicalAnalysis;
  communityRedlines: CommunityRedline[];
  practiceMinutes: number;
  iterationCount: number;
  tags: string[];
}

export interface ArtistProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  currentStreakDays: number;
  totalPracticeHours: number;
  monthlySubmissionsCount: number;
  skillScores: {
    proportion: number;
    perspective: number;
    valueScale: number;
    anatomy: number;
    gesture: number;
  };
}

export interface DailyDrill {
  id: string;
  title: string;
  category: CritiqueFocus;
  durationMinutes: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  steps: string[];
  referenceImage: string;
}

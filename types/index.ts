export interface User {
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  scores: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export interface QuizResult {
  _id?: string;
  userId: string;
  answers: number[];
  score: number;
  percentage: number;
  category: QuizCategory;
  createdAt: Date;
}

export type QuizCategory = 
  | 'seed_keeper' 
  | 'walker' 
  | 'supported' 
  | 'borrowed_mind' 
  | 'echo_prisoner';

export interface CategoryInfo {
  id: QuizCategory;
  name: string;
  nameVi: string;
  description: string;
  letter: string;
  tips: string[];
}

export interface AnonymousRoom {
  _id?: string;
  participants: string[];
  mode: 'text' | 'voice';
  status: 'waiting' | 'active' | 'ended';
  messages: Message[];
  createdAt: Date;
  endedAt?: Date;
}

export interface Message {
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

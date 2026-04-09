export type Candidate = {
  id: number;
  name: string;
  email: string;
  position: string;
  experience_level: string;
  resume_url: string;
  status: string;
  applied_at: string;
};

export type StatusColorMap = Record<string, string>;

export const STATUS_COLORS: StatusColorMap = {
  'Pendente': '#f59e0b',
  'Em Análise': '#3b82f6',
  'Aprovado': '#10b981',
  'Rejeitado': '#ef4444'
};

export const STATUS_OPTIONS = ['Pendente', 'Em Análise', 'Aprovado', 'Rejeitado'] as const;

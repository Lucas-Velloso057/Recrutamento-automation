import { Candidate } from '../types/candidate';

export const candidateService = {
  async getAll(): Promise<Candidate[]> {
    const res = await fetch('/api/admin/candidates');
    if (!res.ok) throw new Error('Erro ao buscar candidatos');
    return res.json();
  },

  async updateStatus(id: number, status: string): Promise<boolean> {
    const res = await fetch('/api/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    return res.ok;
  },

  async submitApplication(formData: FormData): Promise<boolean> {
    const response = await fetch('/api/candidaturas', {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  }
};

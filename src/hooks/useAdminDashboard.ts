import { useState, useEffect, useMemo } from 'react';
import { Candidate } from '../types/candidate';
import { candidateService } from '../services/candidateService';

export const useAdminDashboard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [englishFilter, setEnglishFilter] = useState('Todos');

  useEffect(() => {
    candidateService.getAll()
      .then(data => {
        if (Array.isArray(data)) setCandidates(data);
      })
      .catch(err => {
        console.error("Erro ao buscar candidatos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const ok = await candidateService.updateStatus(id, newStatus);
      if (ok) {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      } else {
        alert('Erro ao atualizar status do candidato!');
      }
    } catch (error) {
      alert('Erro de rede ao atualizar.');
    }
  };

  const chartData = useMemo(() => {
    const counts = candidates.reduce((acc, curr) => {
      const cleanStatus = curr.status?.trim() || 'Pendente'; 
      acc[cleanStatus] = (acc[cleanStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status] || 0
    })).filter(item => item.value > 0);
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    if (englishFilter === 'Todos') return candidates;
    return candidates.filter(c => c.experience_level === englishFilter);
  }, [candidates, englishFilter]);

  const availableEnglishLevels = useMemo(() => {
    const levels = candidates.map(c => c.experience_level).filter(Boolean);
    return Array.from(new Set(levels)).sort();
  }, [candidates]);

  return {
    candidates: filteredCandidates,
    loading,
    englishFilter,
    setEnglishFilter,
    updateStatus,
    chartData,
    availableEnglishLevels
  };
};

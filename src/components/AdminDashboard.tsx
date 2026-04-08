import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Candidate = {
  id: number;
  name: string;
  email: string;
  position: string;
  experience_level: string;
  resume_url: string;
  status: string;
  applied_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  'Pendente': '#f59e0b',
  'Em Análise': '#3b82f6',
  'Aprovado': '#10b981',
  'Rejeitado': '#ef4444'
};

const STATUS_OPTIONS = ['Pendente', 'Em Análise', 'Aprovado', 'Rejeitado'];

export const AdminDashboard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/candidates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCandidates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar candidatos:", err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
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
      // Limpa os espaços em branco para garantir que faça match com a key no dict 
      // (ex. se o DB tiver "Pendente " ou " Pendente")
      const cleanStatus = curr.status?.trim() || 'Pendente'; 
      acc[cleanStatus] = (acc[cleanStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status] || 0
    })).filter(item => item.value > 0);
  }, [candidates]);

  if (loading) return <div className="min-h-screen flex items-center justify-center p-8 text-slate-500">Carregando Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard de RH</h1>
          <p className="text-slate-500 mt-2 text-base">Gerencie e analise as candidaturas pendentes.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Pizza */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Distribuição de Status</h2>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Sem dados ainda.</div>
              )}
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden col-span-1 lg:col-span-2 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Candidatos Recentes</h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Candidato</th>
                    <th className="px-6 py-4">Vaga & Nível</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{c.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-800 font-medium">{c.position}</p>
                        <p className="text-xs text-slate-500 mt-1">{c.experience_level}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className="bg-white border border-slate-300 text-slate-700 font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full max-w-[140px] cursor-pointer"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-500">Nenhum candidato encontrado no banco de dados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

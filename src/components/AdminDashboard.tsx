import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { STATUS_COLORS, STATUS_OPTIONS } from '../types/candidate';

export const AdminDashboard = () => {
  const {
    candidates,
    loading,
    englishFilter,
    setEnglishFilter,
    updateStatus,
    chartData,
    availableEnglishLevels
  } = useAdminDashboard();

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
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Candidatos Recentes</h2>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600 font-medium">Filtrar Inglês:</label>
                <select 
                  value={englishFilter} 
                  onChange={(e) => setEnglishFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  {availableEnglishLevels.map(level => (
                     <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4 relative group">
                      Candidato
                    </th>
                    <th className="px-6 py-4">Vaga</th>
                    <th className="px-6 py-4">Nível de Inglês</th>
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
                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {c.position}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {c.experience_level}
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
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500">Nenhum candidato encontrado.</td>
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

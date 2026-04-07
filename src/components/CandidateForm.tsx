import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, CandidateFormData } from '../schemas/candidateSchema';

export const CandidateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  const onSubmit = async (data: CandidateFormData) => {
    try {
      // Como temos um ficheiro, precisamos construir um FormData
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('position', data.position);

      // O react-hook-form coloca os ficheiros num array
      if (data.resume && data.resume.length > 0) {
        formData.append('resume', data.resume[0]);
      }

      // Enviamos para a nossa própria API no Bun
      const response = await fetch('/api/candidaturas', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Candidatura enviada com sucesso! A Head de RH agradece.');
        // Aqui no futuro podemos limpar o formulário ou redirecionar
      } else {
        alert('Erro ao enviar candidatura. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na submissão:', error);
      alert('Erro interno de comunicação.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Junte-se a nós</h2>
          <p className="text-sm text-gray-500 mt-2">Preencha os dados abaixo para a sua candidatura.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              {...register('fullName')}
              type="text"
              placeholder="Ex: João Silva"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
            />
            {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName.message}</span>}
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              {...register('email')}
              type="email"
              placeholder="joao@email.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Vaga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaga de Interesse</label>
            <select
              {...register('position')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors bg-white ${errors.position ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
            >
              <option value="">Selecione uma vaga...</option>
              <option value="Frontend">Frontend Developer</option>
              <option value="Backend">Backend Developer</option>
              <option value="Fullstack">Fullstack Developer</option>
              <option value="Design">Product Designer</option>
            </select>
            {errors.position && <span className="text-red-500 text-xs mt-1 block">{errors.position.message}</span>}
          </div>

          {/* Currículo */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Currículo (PDF/Word, máx. 5MB)</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${errors.resume ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
              <div className="space-y-1 text-center">
                <input
                  {...register('resume')}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
            {errors.resume && <span className="text-red-500 text-xs mt-2 block text-center">{errors.resume.message as string}</span>}
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                A processar...
              </span>
            ) : 'Enviar Candidatura'}
          </button>

        </form>
      </div>
    </div>
  );
};
import { ExperienceLevels } from '../enum/experienceLevels';
import { useCandidateForm } from '../hooks/useCandidateForm';

export const CandidateForm = () => {
  const {
    form: { register },
    onSubmit,
    isSubmitted,
    isSubmitting,
    errors
  } = useCandidateForm();

  // Converte o Enum para um Array para podermos usar o .map()
  const experienceOptions = Object.values(ExperienceLevels);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Candidatura Recebida!</h2>
          <p className="text-gray-500">
            Agradecemos o seu interesse. A Head de RH irá analisar o seu perfil e entrará em contacto em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Junte-se a nós</h2>
          <p className="text-sm text-gray-500 mt-2">Preencha os dados abaixo para a sua candidatura.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">

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
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Fullstack Developer">Fullstack Developer</option>
              <option value="Product Designer">Product Designer</option>
            </select>
            {errors.position && <span className="text-red-500 text-xs mt-1 block">{errors.position.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Inglês</label>
            <select
              {...register('englishLevel')} // Deve bater com o nome no Schema
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors bg-white ${
                errors.englishLevel ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
            >
              <option value="">Selecione seu nível...</option>
              {experienceOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.englishLevel && (
              <span className="text-red-500 text-xs mt-1 block font-medium">
                {errors.englishLevel.message}
              </span>
            )}
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
                Processando...
              </span>
            ) : 'Enviar Candidatura'}
          </button>

        </form>
      </div>
    </div>
  );
};
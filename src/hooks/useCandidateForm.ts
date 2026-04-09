import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, CandidateFormData } from '../schemas/candidateSchema';
import { candidateService } from '../services/candidateService';

export const useCandidateForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  const onSubmit = async (data: CandidateFormData) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('position', data.position);
      formData.append('englishLevel', data.englishLevel);
      if (data.resume && data.resume.length > 0) {
        formData.append('resume', data.resume[0]);
      }

      const ok = await candidateService.submitApplication(formData);

      if (ok) {
        setIsSubmitted(true);
      } else {
        alert('Erro ao enviar candidatura. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na submissão:', error);
      alert('Erro interno de comunicação.');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitted,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};

import React from 'react';
import { createRoot } from 'react-dom/client';
import { CandidateForm } from './components/CandidateForm';

// O '!' diz ao TypeScript que temos a certeza que o elemento 'root' existe no HTML
const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CandidateForm />
  </React.StrictMode>
);
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CandidateForm } from './components/CandidateForm';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CandidateForm />
  </React.StrictMode>
);
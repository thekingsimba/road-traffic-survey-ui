import '@shared/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { Router } from './providers/RouterProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router />
      <div id='global-modals-container' />
    </I18nextProvider>
  </StrictMode>,
);

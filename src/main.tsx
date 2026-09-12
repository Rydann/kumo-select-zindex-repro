// Mirrors our app's entry: StrictMode + Kumo TooltipProvider, CSS via the stylesheet import.
// (The real app also mounts Kumo's <Toasty>; omitted here as it needs a toast manager and has
// no bearing on stacking - the bug reproduces identically with or without it.)
import { TooltipProvider } from '@cloudflare/kumo/components/tooltip';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
);

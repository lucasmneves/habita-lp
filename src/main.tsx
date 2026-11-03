import { createRoot } from 'react-dom/client';
import { RuntimeLoader } from '@rive-app/canvas';
import { App } from './App';
import './styles/main.css';
import './styles/header.css';
import './styles/modern.css';

// Começa a preparar o runtime antes que os dois componentes montem.
void RuntimeLoader.awaitInstance().catch(() => {});
const root = document.getElementById('root')!;
const loader = document.getElementById('site-loader');
let revealed = false;
const revealSite = () => {
  if (revealed) return;
  revealed = true;
  window.clearTimeout(fallbackTimer);
  root.removeAttribute('inert');
  root.removeAttribute('aria-busy');
  loader?.classList.add('is-done');
  window.setTimeout(() => loader?.remove(), 400);
};
const fallbackTimer = window.setTimeout(revealSite, 12000);

createRoot(root).render(<App onMascotsReady={() => {
  // Aguarda a troca visual dos desenhos de reserva e a primeira pintura dos canvases.
  window.setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(revealSite)), 260);
}} />);

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
const loaderStartedAt = performance.now();
let revealed = false;
const revealSite = () => {
  if (revealed) return;
  // Uma volta dura 1,8 s: mantém o anel visível por pelo menos uma volta e meia.
  const animation = loader?.querySelector('.site-loader-arc')?.getAnimations()[0];
  const elapsed = typeof animation?.currentTime === 'number'
    ? animation.currentTime : performance.now() - loaderStartedAt;
  const remaining = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2700 - elapsed;
  if (remaining > 0) {
    window.setTimeout(revealSite, Math.ceil(remaining));
    return;
  }
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

import { createRoot } from 'react-dom/client';
import { RuntimeLoader } from '@rive-app/canvas';
import { App } from './App';
import './styles/main.css';
import './styles/header.css';
import './styles/modern.css';

// Começa a preparar o runtime antes que os dois componentes montem.
void RuntimeLoader.awaitInstance().catch(() => {});
createRoot(document.getElementById('root')!).render(<App />);

import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/main.css';
import './styles/header.css';
import './styles/modern.css';

createRoot(document.getElementById('root')!).render(<App />);
